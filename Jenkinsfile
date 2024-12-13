pipeline {
    agent any
    
    environment {
        // 필요한 환경 변수 설정
        PYTHON_ENV = "python3"
        DEPLOY_DIR = "/path/to/deploy"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Git에서 feature/ml 브랜치 체크아웃, 자격 증명 추가
                git branch: 'feature/ml', 
                    credentialsId: 'github-access-token', // Jenkins에 등록된 자격 증명 ID
                    url: 'https://github.com/Weather-Tracker-Project/weather-tracker-backend.git'
            }
        }
        
        stage('Setup Python Environment') {
            steps {
                // Python 가상 환경 설정
                script {
                    sh 'python3 -m venv venv'
                    sh '. venv/bin/activate'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // 필요한 Python 패키지 설치
                script {
                    sh '. venv/bin/activate && pip install -r requirements.txt'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                // 배포 스크립트 실행
                script {
                    sh '. venv/bin/activate && python main.py'
                }
            }
        }
    }
    
    post {
        success {
            echo '배포가 성공적으로 완료되었습니다.'
        }
        
        failure {
            echo '배포 중 오류가 발생했습니다.'
        }
    }
}
