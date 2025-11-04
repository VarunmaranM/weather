pipeline {
  agent any

  environment {
    // Configure these in Jenkins Credentials (Secret text)
    EC2_HOST = credentials('ec2-host')
    EC2_USER = credentials('ec2-user-text')

    // SSH key credential ID (SSH Username with private key)
    EC2_SSH_CREDENTIALS = 'ec2-ssh-key'

    APP_NAME   = 'weather'
    IMAGE_TAG  = "${env.BUILD_NUMBER}"
    REMOTE_DIR = '/opt/weather'
  }

  options {
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Provision Docker on EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.EC2_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            set -e
            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" '
              if ! command -v docker >/dev/null 2>&1; then
                if [ -f /etc/os-release ]; then
                  . /etc/os-release
                  if [ "$ID" = "amzn" ] || echo "$ID_LIKE" | grep -qi amazon; then
                    sudo yum update -y || true
                    sudo yum install -y docker
                  else
                    curl -fsSL https://get.docker.com | sh
                  fi
                else
                  curl -fsSL https://get.docker.com | sh
                fi
              fi
              sudo systemctl enable --now docker || sudo service docker start || true
            '
          '''
        }
      }
    }

    stage('Sync Source to EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.EC2_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            set -e
            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "sudo mkdir -p $REMOTE_DIR && sudo chown -R \"$EC2_USER\":\"$EC2_USER\" $REMOTE_DIR"
            tar -czf - --exclude .git --exclude node_modules . | 
              ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "tar -xzf - -C $REMOTE_DIR"
          '''
        }
      }
    }

    stage('Build Image on EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.EC2_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            set -e
            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && sudo docker build -t $APP_NAME:$IMAGE_TAG ."
          '''
        }
      }
    }

    stage('Deploy Container on EC2') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: env.EC2_SSH_CREDENTIALS, keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
          sh '''
            set -e
            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "$EC2_USER@$EC2_HOST" "cd $REMOTE_DIR && sudo docker rm -f $APP_NAME || true && sudo docker run -d --name $APP_NAME -p 80:80 --restart unless-stopped $APP_NAME:$IMAGE_TAG"
          '''
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}

