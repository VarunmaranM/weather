pipeline {
  agent any

  environment {
    // Configure these in Jenkins Credentials (Secret text)
    EC2_HOST = credentials('ec2-host')                // e.g. ec2-54-147-167-84.compute-1.amazonaws.com
    EC2_USER = credentials('ec2-user-text')           // e.g. ec2-user or ubuntu

    // Configure this in Jenkins Credentials (SSH Username with private key)
    EC2_SSH_CREDENTIALS = 'ec2-ssh-key'               // private key for the instance

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
        sshagent (credentials: [env.EC2_SSH_CREDENTIALS]) {
          powershell '''
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "which docker || (curl -fsSL https://get.docker.com | sh)"
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "sudo systemctl enable --now docker || sudo service docker start || true"
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "sudo usermod -aG docker $USER || true"
          '''
        }
      }
    }

    stage('Sync Source to EC2') {
      steps {
        sshagent (credentials: [env.EC2_SSH_CREDENTIALS]) {
          powershell '''
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "sudo mkdir -p $env:REMOTE_DIR && sudo chown -R $USER:$USER $env:REMOTE_DIR"
            tar -czf - --exclude .git --exclude node_modules . | 
              ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "tar -xzf - -C $env:REMOTE_DIR"
          '''
        }
      }
    }

    stage('Build Image on EC2') {
      steps {
        sshagent (credentials: [env.EC2_SSH_CREDENTIALS]) {
          powershell '''
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" "cd $env:REMOTE_DIR && docker build -t $env:APP_NAME:$env:IMAGE_TAG ."
          '''
        }
      }
    }

    stage('Deploy Container on EC2') {
      steps {
        sshagent (credentials: [env.EC2_SSH_CREDENTIALS]) {
          powershell '''
            $cmd = @'
set -e
cd $REMOTE_DIR
docker rm -f $APP_NAME || true
docker run -d --name $APP_NAME -p 80:80 --restart unless-stopped $APP_NAME:$IMAGE_TAG
'@
            ssh -o StrictHostKeyChecking=no "$env:EC2_USER@$env:EC2_HOST" $cmd
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

