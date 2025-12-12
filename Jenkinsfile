pipeline {
	agent any

    tools {
        nodejs 'NodeJS 18' 
    }
	environment {
		GIT_CREDENTIALS_ID = 'github-pat-user-creds'
		SSH_CREDENTIALS_ID = 'huoshan-server'
		DEPLOY_HOST = '118.196.24.101'       // TODO: replace with your target host
		DEPLOY_PATH = '/var/www/cardkey-web' // TODO: replace with your deploy path
		DEPLOY_PORT = '22'
		NODE_OPTIONS = '--max_old_space_size=4096'
	}

	options {
		ansiColor('xterm')
		disableConcurrentBuilds()
		timestamps()
	}

	stages {
		stage('Checkout') {
			steps {
				checkout([
					$class: 'GitSCM',
					branches: [[name: env.BRANCH_NAME ? "*/${env.BRANCH_NAME}" : '*/main']],
					userRemoteConfigs: [[
						url: env.GIT_URL ?: 'https://github.com/hanhongxin1028/cardkey-web.git',
						credentialsId: env.GIT_CREDENTIALS_ID
					]],
					extensions: [[$class: 'CleanBeforeCheckout']]
				])
			}
		}

		stage('Install') {
			steps {
				sh 'corepack enable || true'
				sh 'npm install --no-audit --no-fund'
			}
		}

		// stage('Lint') {
		// 	when { expression { fileExists('eslint.config.js') } }
		// 	steps {
		// 		sh 'npm run lint'
		// 	}
		// }

		stage('Build') {
			steps {
				sh 'npm run build'
			}
		}

		stage('Archive') {
			steps {
				sh 'tar -C dist -czf dist.tar.gz .'
				archiveArtifacts artifacts: 'dist.tar.gz', fingerprint: true
			}
		}

		stage('Deploy') {
			steps {
				withCredentials([
					sshUserPrivateKey(
						credentialsId: env.SSH_CREDENTIALS_ID,
						keyFileVariable: 'SSH_KEY',
						usernameVariable: 'SSH_USER'
					)
				]) {
					sh '''
						set -e
						export RSYNC_RSH="ssh -i $SSH_KEY -p ${DEPLOY_PORT} -o StrictHostKeyChecking=no"
						rsync -az --delete dist/ "${SSH_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"
					'''
				}
			}
		}
	}

	post {
		cleanup {
			cleanWs()
		}
	}
}
