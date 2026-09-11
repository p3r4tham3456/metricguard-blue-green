pipeline {
    agent any

    triggers {
        cron('* * * * *')
    }

    options {
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'MetricGuard automatic rollback monitoring started'
            }
        }

        stage('Check Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Check Blue Health') {
            steps {
                script {
                    def blueStatus = sh(
                        script: '''
                            curl -s -o /dev/null -w "%{http_code}" \
                            --connect-timeout 5 \
                            --max-time 10 \
                            http://localhost:5001/health || true
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "Blue HTTP status: ${blueStatus}"

                    if (blueStatus == '200') {
                        env.BLUE_HEALTHY = 'true'
                        echo "Blue V2 is healthy"
                    } else {
                        env.BLUE_HEALTHY = 'false'
                        echo "Blue V2 is UNHEALTHY"
                    }
                }
            }
        }

        stage('Check Green Health') {
            steps {
                script {
                    def greenStatus = sh(
                        script: '''
                            curl -s -o /dev/null -w "%{http_code}" \
                            --connect-timeout 5 \
                            --max-time 10 \
                            http://localhost:5000/health || true
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "Green HTTP status: ${greenStatus}"

                    if (greenStatus == '200') {
                        env.GREEN_HEALTHY = 'true'
                        echo "Green V1 is healthy"
                    } else {
                        env.GREEN_HEALTHY = 'false'
                        echo "Green V1 is UNHEALTHY"
                    }
                }
            }
        }

        stage('Detect Active Environment') {
            steps {
                script {
                    if (
                        sh(
                            script: 'grep -q "proxy_pass http://127.0.0.1:5001" /etc/nginx/sites-available/green',
                            returnStatus: true
                        ) == 0
                    ) {
                        env.ACTIVE_ENVIRONMENT = 'BLUE'
                        echo "Active environment: BLUE"

                    } else if (
                        sh(
                            script: 'grep -q "proxy_pass http://127.0.0.1:5000" /etc/nginx/sites-available/green',
                            returnStatus: true
                        ) == 0
                    ) {
                        env.ACTIVE_ENVIRONMENT = 'GREEN'
                        echo "Active environment: GREEN"

                    } else {
                        error('Unable to detect active environment from Nginx')
                    }
                }
            }
        }

        stage('Automatic Rollback') {
            steps {
                script {

                    if (
                        env.ACTIVE_ENVIRONMENT == 'BLUE' &&
                        env.BLUE_HEALTHY == 'false' &&
                        env.GREEN_HEALTHY == 'true'
                    ) {

                        echo "Blue V2 is unhealthy"
                        echo "Green V1 is healthy"
                        echo "Starting automatic rollback"

                        sh '''
                            sudo /usr/local/bin/metricguard-rollback
                        '''

                        env.ROLLBACK_PERFORMED = 'true'

                        echo "Traffic successfully switched from Blue to Green"

                    } else if (
                        env.ACTIVE_ENVIRONMENT == 'BLUE' &&
                        env.BLUE_HEALTHY == 'false' &&
                        env.GREEN_HEALTHY == 'false'
                    ) {

                        error('Both Blue and Green are unhealthy. Rollback is unsafe.')

                    } else {

                        env.ROLLBACK_PERFORMED = 'false'
                        echo "Rollback conditions not satisfied"
                        echo "No rollback performed"
                    }
                }
            }
        }

        stage('Verify Production Traffic') {
            steps {
                script {

                    def productionResponse = sh(
                        script: '''
                            curl -s --connect-timeout 5 \
                            --max-time 10 \
                            http://localhost/health || true
                        ''',
                        returnStdout: true
                    ).trim()

                    echo "Production response: ${productionResponse}"

                    if (env.ROLLBACK_PERFORMED == 'true') {

                        if (productionResponse.contains('"version":"1.0"')) {
                            echo "Automatic rollback successful"
                            echo "Production traffic is now reaching Green V1"
                        } else {
                            error('Rollback was attempted but Green V1 was not detected')
                        }

                    } else {
                        echo "Production remains on the current active environment"
                    }
                }
            }
        }
    }
}
