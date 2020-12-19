---
title: "Qt 숫자야구"
categories: dev
tags: c++
date: '2020-12-17 17:40:00 +0900'
image: /assets/img/dev/QT_NBaseBall.png
---
**소개**<br>
이번에는 Qt의 `Label`, `LineEdit`, `PushButton`을 이용하여 간단한 숫자야구 게임을 구현해 보았습니다.

`LineEdit`의 textChanged(Signal), `KeyBoardEvent`와 `random`을 사용하여 구현 하였습니다.
<!--more-->

* toc
{:toc .large-only}

## 구현
**폴더구조**
```coffeescript
src 
|-main.cpp
|-NumberBaseBall.cpp
|-NumberBaseBall.h
|-CMakeLists.txt
|-mainwindow.ui      
```
기본 클래스들로 구성한 UI(Label , LineEdit, PushButton)을 이용하여 구현 하였습니다.

* mainwindow.ui
* NumberBaseBall.h
* NumberBaseBall.cpp

순서로 설명하도록 하겠습니다.

### UI
<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>NumberBaseBall</class>
 <widget class="QMainWindow" name="NumberBaseBall">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>481</width>
    <height>145</height>
   </rect>
  </property>
  <property name="minimumSize">
   <size>
    <width>481</width>
    <height>145</height>
   </size>
  </property>
  <property name="maximumSize">
   <size>
    <width>481</width>
    <height>145</height>
   </size>
  </property>
  <property name="windowTitle">
   <string>숫자야구</string>
  </property>
  <widget class="QWidget" name="centralwidget">
   <property name="styleSheet">
    <string notr="true">#centralwidget {
background-color: white;
}</string>
   </property>
   <widget class="QPushButton" name="btn1">
    <property name="geometry">
     <rect>
      <x>340</x>
      <y>70</y>
      <width>121</width>
      <height>51</height>
     </rect>
    </property>
    <property name="styleSheet">
     <string notr="true">#btn1 {
               background-color:#444;
               font-size: 30px;
               color: white;
               border-radius: 15px;
               }</string>
    </property>
    <property name="text">
     <string>확인</string>
    </property>
   </widget>
   <widget class="QLineEdit" name="lE1">
    <property name="geometry">
     <rect>
      <x>10</x>
      <y>90</y>
      <width>281</width>
      <height>31</height>
     </rect>
    </property>
    <property name="text">
     <string>text</string>
    </property>
   </widget>
   <widget class="QLabel" name="lb1">
    <property name="geometry">
     <rect>
      <x>10</x>
      <y>20</y>
      <width>461</width>
      <height>51</height>
     </rect>
    </property>
    <property name="font">
     <font>
      <family>Hack</family>
      <pointsize>16</pointsize>
      <weight>75</weight>
      <bold>true</bold>
     </font>
    </property>
    <property name="text">
     <string>4자리 숫자를 입력하세요!</string>
    </property>
    <property name="alignment">
     <set>Qt::AlignLeading|Qt::AlignLeft|Qt::AlignVCenter</set>
    </property>
   </widget>
  </widget>
 </widget>
 <resources/>
 <connections/>
</ui>
```

</details>
<br>

이전에 구현했던 [끝말잇기](https://xploitdev.com/dev/Wordrelay/)와 거의 같은 모습을 하고있습니다. `lE1`, `lb1`, `btn1` 세가지 위젯을 중심으로 구현 하였습니다.  

### 메인 헤더
<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```cpp
class NumberBaseBall : public QMainWindow {
Q_OBJECT
public:
    explicit NumberBaseBall(QMainWindow* parent);
    ~NumberBaseBall();

    void keyPressEvent(QKeyEvent* event) override;
public slots:
    void slot_btnClick();
    void slot_changeText(const QString &text);
private:
    std::unique_ptr<Ui::NumberBaseBall> ui;
    std::unique_ptr<QRegExpValidator> rxv;
    std::unique_ptr<QMessageBox> m_box;

    QString m_input;
    QString m_answer;
    int m_numberOfAttempts;
    void CreateAnswerData();
};
```

</details>
<br>

메인창인 `NumberBaseBall`클래스의 헤더부분입니다. 주요부분은 아래와 같습니다.
* rxv : 입력값 검증을 위한 `QRegExpValidator`입니다. 정규표현식을 사용하여 입력값 검증을 위한 객체 입니다.
* m_box : 메시지 박스
* m_input/m_answer : 입력 값/ 정답 값을 저장하기 위한 데이터 변수
* m_numberOfAttemps : 시도횟수 저장 변수
* CreateAnswerData() : 게임 초기화 및 새로운 정답 생성
* slot_changeText() : 텍스트 변경이 이루어졌을때 호출되는 slot함수 지정입니다.

### 메인 CPP
**생성자**
```cpp
NumberBaseBall::NumberBaseBall(QMainWindow* parent)
        :QMainWindow(parent),
         ui(new Ui::NumberBaseBall),
         m_input(""),
         m_answer(""),
         rxv(new QRegExpValidator(QRegExp("[+-]?\\d*"), this)),
         m_box(new QMessageBox(this)),
         m_numberOfAttempts(0)
{
    ui->setupUi(this);

    ui->lE1->setText("");
    ui->lE1->setValidator(rxv.get());

    CreateAnswerData(); // 상태 초기화

    //버튼 및 LineEdit Event Bind
    connect(ui->btn1, &QPushButton::clicked, this, &NumberBaseBall::slot_btnClick);
    connect(ui->lE1, &QLineEdit::textChanged, this, &NumberBaseBall::slot_changeText);
}
```
생성자에서는 게임시작전 기본적인 초기화 및 데이터 생성을 담당합니다. 다음과 같은 작업을 수행합니다.
* Ui 연결
* rxv(정규표현식 입력 데이터 검증) 연결
* 게임 초기화 및 정답 데이터 생성
* LineEdit의 값과 클래스 내부 실제 값의 연결
* 버튼과 클릭 함수 연결

**초기화 함수**
```cpp
void NumberBaseBall::CreateAnswerData()
{
    std::random_device rd;

    QVector<int> shuffle(10);

    std::iota(shuffle.begin(), shuffle.end(), 0);
    std::shuffle(shuffle.begin(), shuffle.end(), std::mt19937{rd()});

    m_answer = ""; // 정답 초기화

    // 셔플 앞 4개 숫자 선택
    for (int i = 0; i<4; ++i) {
        m_answer.push_back(QString::number(shuffle[i]));
    }

    // 시도횟수 초기화
    m_numberOfAttempts = 0;

    qDebug() << m_answer;
}
```
다음은 게임 데이터 초기화 함수 입니다. 다음과 같은 작업을 수행합니다.
* `iota/shuffle`을 이용한 0~9 랜덤 숫자 배열을 생성합니다.(중복X)
* 생성한 숫자 4개를 선택하여 `m_answer`에 입력합니다. (정답 생성)
* 시도횟수(`m_numberOfAttempts`)의 초기화

**LineEdit 변경 이벤트**
```cpp
void NumberBaseBall::slot_changeText(const QString& text)
{
    m_input = text;
}
```
해당 함수는 signal로 넘어온 `LineEdit`의 text를 실제 데이터의 input값과 연결시킵니다.

**버튼 클릭 이벤트**
```cpp
void NumberBaseBall::slot_btnClick()
{
    auto LineText = ui->lE1->text();
    // Basic input Error handling
    if (LineText.length()!=4) {
        m_box->setWindowTitle("Error!");
        m_box->setText("4자리 숫자만 입력 가능합니다.");
        m_box->show();
        return;
    }
    if (m_input==m_answer) {
        //정답 메시지 출력 + 초기화
        ui->lb1->setText("홈런!!!");
        ui->lE1->setText("");
        ui->lE1->setFocus();
        CreateAnswerData();
    }
    else {
        // 정답 아님, count가 10회를 넘어가는 경우 정답 출력 + 초기화
        int maxAttemps = 10;
        m_numberOfAttempts++;
        // 카운트가 10회가 넘었을 경우
        if (m_numberOfAttempts>maxAttemps) {
            QString msg("10회 틀려서 실패 정답은"+m_answer+"이었습니다!!");
            ui->lb1->setText(msg);
            ui->lE1->setText("");
            ui->lE1->setFocus();
            CreateAnswerData();
            return;
        }
        else {
            int strike = 0;
            int ball = 0;

            // 스트라이크, 볼 계산
            for (int i = 0; i<4; i++) {
                if (m_input[i]==m_answer[i]) {
                    strike++;
                }
                else {
                    if (m_answer.contains(m_input[i])) {
                        ball++;
                    }
                }
            }
            auto msg = QString("%1 스트라이크 %2 볼 입니다.").arg(strike).arg(ball);
            ui->lb1->setText(msg);
            ui->lE1->setText("");
            ui->lE1->setFocus();
        }
    }
}
```
* 입력된 값의 길이를 검증
* 정답/ 실패 처리
* 각각 정답이거나 10회 실패시 초기화 함수 호출

## 결과
![NumberBaseBall](/assets/img/dev/QT_NBaseBall.png)

전체 코드는 [Github](https://github.com/ryanhe4/Qt_Programs/tree/master/NumberBaseBall)에서 확인 할 수 있습니다.
