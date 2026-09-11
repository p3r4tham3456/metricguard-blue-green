pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'MetricGuard Jenkins pipeline started successfully'
            }
        }

        stage('Check Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -t v2:${BUILD_NUMBER} .
                    echo "Docker image built successfully"
                '''
            }
        }

        stage('Check Blue Environment') {
            steps {
                sh '''
                    echo "Checking Blue environment on port 5001..."
                    curl -f http://localhost:5001/health
                    echo "Blue environment is healthy"
                '''
            }
        }

        stage('Check Green Environment') {
            steps {
                sh '''
                    echo "Checking Green environment on port 5000..."
                    curl -f http://localhost:5000/health
                    echo "Green environment is healthy"
                '''
            }
        }

        stage('Detect Active Environment') {
            steps {
                sh '''
                    echo "Detecting active environment from Nginx..."

                    if grep -q "proxy_pass http://127.0.0.1:5001" /etc/nginx/sites-available/green; then
                        echo "Currently active environment: BLUE"
                        echo "Deployment target: GREEN"

                    elif grep -q "proxy_pass http://127.0.0.1:5000" /etc/nginx/sites-available/green; then
                        echo "Currently active environment: GREEN"
                        echo "Deployment target: BLUE"

                    else
                        echo "ERROR: Could not detect active environment"
                        exit 1
                    fi
                '''
            }
        }

    }
}
