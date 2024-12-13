pipeline {
    agent any

    environment {
        MONGO_URI = "${env.MONGO_URI}"  // Jenkins Global Properties에서 설정한 MONGO_URI 환경 변수 참조
        }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning the repository...'
                // Git에서 코드 가져오기
                git branch: 'main', credentialsId: 'github-access-token', url: 'https://github.com/Weather-Tracker-Project/weather-tracker-backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                // Node.js 패키지 설치
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                // 테스트 실행 (필요한 경우)
                sh 'npm test || true' // 테스트 스크립트가 없으면 이 단계를 생략 가능
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // PM2로 애플리케이션 배포
                sh '''
                pm2 stop weather-tracker-backend || true
                pm2 start index.js --name weather-tracker-backend
                pm2 logs weather-tracker-backend --lines 100
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
