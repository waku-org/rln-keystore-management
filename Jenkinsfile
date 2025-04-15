#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.8.8'

pipeline {
  agent { label 'linux' }

  parameters {
    string(
      name: 'IMAGE_TAG',
      defaultValue: params.IMAGE_TAG ?: '',
      description: 'Optional Docker image tag to push.'
    )
  }

  options {
    disableConcurrentBuilds()
    /* manage how many builds we keep */
    buildDiscarder(logRotator(
      numToKeepStr: '20',
      daysToKeepStr: '30',
    ))
  }

  environment {
    IMAGE_NAME = 'statusteam/rln-keystore-management'
    NEXT_PUBLIC_SITE_URL = "https://${env.JOB_BASE_NAME}"
  }

  stages {
    stage('Build') {
      steps {
        script {
          image = docker.build("${IMAGE_NAME}:${GIT_COMMIT.take(8)}")
        }
      }
    }

    stage('Push') {
      steps { script {
        withDockerRegistry([credentialsId: 'dockerhub-statusteam-auto', url: '']) {
          image.push()
        }
      } }
    }

    stage('Deploy') {
      when { expression { params.IMAGE_TAG != '' } }
      steps { script {
        withDockerRegistry([credentialsId: 'dockerhub-statusteam-auto', url: '']) {
          image.push(params.IMAGE_TAG)
        }
      } }
    }
  }

  post {
    cleanup { cleanWs() }
  }
}
