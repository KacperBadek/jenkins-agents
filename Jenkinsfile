pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        SONARQUBE_SERVER = 'Local SonarQube'
        APP_DIR = 'app'
    }

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm test'
                }
            }
        }

        stage('Code Coverage Report') {
            steps {
                dir("${APP_DIR}") {
                    sh 'npm run test:coverage'
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Code Coverage'
                    ])
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir("${APP_DIR}") {
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh """
                            npx sonar-scanner \
                                -Dsonar.projectKey=express-app \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/**,coverage/** \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                                -Dsonar.host.url=http://sonarqube:9000
                        """
                    }
                }
            }
        }
    }
}
