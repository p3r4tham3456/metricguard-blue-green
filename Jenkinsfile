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

    }
}
