pipeline {
    agent any

    environment {
            TARGET_DIR = 'target'
            CLASS_DIR = "${TARGET_DIR}/classes"
            TEST_DIR = "${TARGET_DIR}/test-classes"
            REPORT_DIR = "${TARGET_DIR}/reports"
            LIB_DIR = 'lib'
            SRC_DIR = 'src/main/java'
            TEST_SRC_DIR = 'src/test/java'
            VERSION = '1.0.0'
    }

    stages {
        stage('Validation') {
                    steps {
                        sh '''
                        echo "Walidacja struktury katalogów"
                        [ -d "$SRC_DIR" ] || { echo "Brakuje katalogu $SRC_DIR"; exit 1; }
                        [ -d "$TEST_SRC_DIR" ] || { echo "Brakuje katalogu $TEST_SRC_DIR"; exit 1; }
                        [ -d "$LIB_DIR" ] || { echo "Brakuje katalogu $LIB_DIR"; exit 1; }
                        echo "Wszystkie wymagane katalogi istnieją."
                        '''
                    }
                }

        stage('Build') {
                    steps {
                        sh '''
                        echo "Tworzenie katalogów wyjściowych..."
                        mkdir -p "$CLASS_DIR" "$TEST_DIR" "$REPORT_DIR"

                        echo "Kompilacja kodu źródłowego..."
                        find "$SRC_DIR" -name "*.java" > sources.txt
                        javac -cp "$LIB_DIR/*" -d "$CLASS_DIR" @sources.txt

                        echo "Kompilacja testów..."
                        find "$TEST_SRC_DIR" -name "*.java" > test_sources.txt
                        javac -cp "$CLASS_DIR:$LIB_DIR/*" -d "$TEST_DIR" @test_sources.txt

                        echo "Kompilacja zakończona pomyślnie."
                        '''
                    }
                }

        stage('Test') {
                    steps {

                    script {
                        try {
                            sh '''
                            echo "Uruchamianie testów JUnit 5..."
                            java -jar "$LIB_DIR/junit-platform-console-standalone-1.8.1.jar" \
                                --class-path "$CLASS_DIR:$TEST_DIR:$LIB_DIR/*" \
                                --scan-class-path \
                                --reports-dir="$REPORT_DIR"
                            '''
                        } finally {
                            junit "${REPORT_DIR}/*.xml"
                        }
                      }
                    }
                }
        stage('Package') {
                    when {
                        branch 'master'
                    }
                    steps {
                        sh '''
                        echo "Pakowanie aplikacji..."
                        jar cf "app-${BUILD_ID}.jar" -C "${CLASS_DIR}" .
                        echo "Utworzono: app-${BUILD_ID}.jar"
                        '''
                    }
        }
        stage('Archive') {
                    when {
                        branch 'master'
                    }
                    steps {
                        echo "Archiwizowanie artefaktów..."
                        archiveArtifacts artifacts: 'app-*.jar'
                        archiveArtifacts artifacts: "${REPORT_DIR}/*.xml"
                    }
                }
    }
}