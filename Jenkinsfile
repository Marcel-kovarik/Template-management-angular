
def branch = env.BRANCH_NAME
if (branch == 'master') {
    currentEnv = 'PROD'
    buildCmd = 'build-prod'
    serverName = 'adnai-app07-web'
    serverName2 = 'adnai-app20-web'
    remoteDir = 'builder/pub/site'
} else {
    currentEnv = 'DEV'
    buildCmd = 'build-rct'
    serverName = 'vps681349-web'
    remoteDir = 'builder-dev/pub/site'
}
remPrefix = 'dist/builder-front'

pipeline {
    options {
	    buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
	  }
    agent {
        docker {
            image 'node:10-alpine'
            args '-p 3000:3000 -v /var/adnai/npmrc:/root/.npmrc'
        }
    }
    stages {
        stage('Build') {
            steps {
                echo "Start installing npm [${currentEnv}]"
                sh 'npm install'
                echo "Call run build"
                sh "npm run ${buildCmd}"
            }
        }
        stage('Test') {
            steps {
                echo "Running Test"
            }
        }
        stage('Deploy') {
            steps {
                input message: "Deploy to ${serverName} ?"
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: "${serverName}",
                            transfers: [
                                sshTransfer(
                                    cleanRemote: true,
                                    excludes: '',
                                    execCommand: '',
                                    execTimeout: 120000,
                                    flatten: false,
                                    makeEmptyDirs: false,
                                    noDefaultExcludes: false,
                                    patternSeparator: '[, ]+',
                                    remoteDirectory: "${remoteDir}",
                                    remoteDirectorySDF: false,
                                    removePrefix: "${remPrefix}",
                                    sourceFiles: 'dist/**'
                                 )
                            ],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: true,
                            failOnError:true
                        )
                    ]
                )
            }
        }
        stage('Production') {
            when {
                expression {
                    return env.BRANCH_NAME == 'master';
                    }
                }
            steps {
                input message: "Deploying ${currentEnv} to ${serverName2}"
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: "${serverName2}",
                        transfers: [
                            sshTransfer(
                                cleanRemote: true,
                                excludes: '',
                                execCommand: '',
                                execTimeout: 120000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: "${remoteDir}",
                                remoteDirectorySDF: false,
                                removePrefix: "${remPrefix}",
                                sourceFiles: 'dist/**'
                             )
                        ],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: true,
                        failOnError:true
                    )
                ])
            }
        }
    }
    post {
        always {
          cleanWs()
        }
      }
}
