pipeline {
    agent {
        docker {
            image 'hasacz325/custom-jenkins-build-agent:1.0.1'
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        DOCKER_IMAGE = "hasacz325/node-microservice"
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Lint & Static Analysis') {
            steps {
                sh 'npm install'
            }
        }

        stage('Parallel Testing & Coverage') {
            parallel {
                stage('Unit Tests & Coverage') {
                    steps {
                        sh 'npm run test:unit -- --coverage'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'coverage/**', fingerprint: true
                junit 'test-results/**/*.xml'
            }
        }

        stage('Build Application Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest .
                    """
                }
            }
        }

        stage('Push Application Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                    docker push ${DOCKER_IMAGE}:latest
                    docker logout
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            sh """
            docker rmi ${env.DOCKER_IMAGE}:${env.BUILD_NUMBER} || true
            docker rmi ${env.DOCKER_IMAGE}:latest || true
            docker system prune -f || true
            """
        }

        success {
            echo 'Pipeline zakończony sukcesem!'
        }

        failure {
            echo 'Pipeline nie powiódł się.'
        }
    }
}
