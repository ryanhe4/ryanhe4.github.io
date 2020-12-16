---
title: "Qt 끝말잇기"
categories: dev
tags: c++
date: '2020-12-16 12:00:00 +0900'
image: /assets/img/dev/QT_WordRelay.png
---
<!--more-->

## 소개
Qt의 `Label`, `LineEdit`, `PushButton`을 이용하여 간단한 Qt 끝말잇기를 구현해 보았습니다.

기본적인 `Signal/Slot` , `KeyBoardEvent` 등을 사용하여 구현 하였습니다. 

## 구현
**폴더구조**
```coffeescript
src 
|-main.cpp
|-Mainwindow.cpp
|-Mainwindow.h
|-CMakeLists.txt
|-mainwindow.ui      
```
저같은 경우는 `cmake`로 빌드하였기 때문에 CmakeList 파일이 포함됩니다.

**UI**<br>
UI 파일을 통해 기본적인 버튼스타일, 메인윈도우 크기고정, 배경색등을 지정하였습니다.

`UI` 에서 중요한 부분이 가장 위의 class이름/ 각 widget에서의 name 입니다. 코드 상에서 해당 부분을 통해 위젯에 접근 할 수 있습니다.

<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>MainWindow</class>
 <widget class="QMainWindow" name="MainWindow">
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
   <string>WordRelay</string>
  </property>
  <property name="styleSheet">
   <string notr="true">#MainWindow {
background-color: white;
}</string>
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
      <x>20</x>
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
      <x>20</x>
      <y>20</y>
      <width>281</width>
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
     <string>끝말잇기 시작</string>
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
**main.cpp**<br>
`main.cpp`에서는 기본 폼이되는 윈도우를 실행시켜줍니다.

<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```cpp
#include <QApplication>
#include "MainWindow.h"

int main(int argc, char* argv[])
{
    QApplication a(argc, argv);
    MainWindow main_window(nullptr );
    main_window.show();
    return QApplication::exec();
}
```

</details>
<br>

**MainWindow.h**<br>
다음은 메인 윈도우의 헤더 입니다. `생성자`, `소멸자`, `키입력이벤트`, `버튼클릭 slot`을 지정합니다.

<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```cpp
#include <QMainWindow>
#include <QDebug>
#include <QMessageBox>
#include <QKeyEvent>

namespace Ui {
class MainWindow;
}
class MainWindow : public QMainWindow {
    Q_OBJECT
public:
    explicit MainWindow(QMainWindow *parent = nullptr);
    ~MainWindow();

    virtual void keyPressEvent(QKeyEvent *event);
public slots: // Click Event Handler
    void slot_btn();
private:
    Ui::MainWindow *ui;
    QMessageBox *message_box;

};
```

</details>
<br>

### MainWindow.cpp
메인윈도우의 cpp 구현 부분 입니다. 끝말잇기 구현은 생성자/ 소멸자/ 버튼 클릭 이벤트/ 키 입력 이벤트의 4부분로 구현하였습니다.

**생성자**
```cpp
MainWindow::MainWindow(QMainWindow* parent)
        :QMainWindow(parent),
         ui(new Ui::MainWindow),
         message_box(new QMessageBox(this))
{
    ui->setupUi(this);
    ui->lb1->setText("시작단어");
    ui->lE1->setText("");

    message_box->setText("땡!!");
    
    connect(ui->btn1, &QPushButton::clicked, this, &MainWindow::slot_btn);
}
```
생성자는 앞서 구현한 `ui를 연결`하고 `message_box`를 생성하고, 앞서 선언한 버튼 클릭이벤트 슬롯을 버튼에 연결 시킵니다.

**소멸자**
```cpp
MainWindow::~MainWindow() noexcept
{
    delete ui;
    delete message_box;
}
```
소멸자에서는 생성했던 ui/message_box를 제거합니다.

**버튼 클릭 함수(이벤트 리스너)**
```cpp
void MainWindow::slot_btn()
{
    QString questionWord = ui->lb1->text();
    QString answerWord = ui->lE1->text();

    if (questionWord[questionWord.size()-1]==answerWord[0]) {
        ui->lb1->setText(answerWord);
        ui->lE1->setText("");
    }
    else {
        message_box->show();

        ui->lE1->setText("");
    }
}
```
버튼 클릭 함수에서는 실제 동작을 정의 합니다.
* ui에서 선언한 `Label의 text`, `lineEdit의 text`를 가져옵니다.
* 라벨->Text의 가장 뒷자리와 lineEdit->Text의 가장 앞자리의 비교를 수행합니다.
* 해당 값이 같을 경우 `Label`의 text를 `lineEdit`의 text값으로 변경합니다. 
* 해당 값이 다를 경우 `messageBox`를 출력하고 `lineEdit`의 텍스트를 초기화 합니다.

**키보드 입력 이벤트**
```cpp
void MainWindow::keyPressEvent(QKeyEvent* event)
{
    switch (event->key()) {
    case Qt::Key_Return: ui->btn1->click();
        break;
    }
}
```
키보드 입력 이벤트에서 엔터를 입력한 경우 버튼이 클릭되도록 정의하였습니다.

입력 이벤트 중에 `Key_Return` 과 `Key_Enter`가 존재하는데 `Key_Return` 값이 중앙에 있는 Enter를 의미하고 `Key_Enter`는 키패드 오른쪽 Enter를 의미합니다.

## 결과
![result](/assets/img/dev/QT_WordRelay.png)

사용 코드는 [Github](https://github.com/ryanhe4/Qt_Programs/tree/master/WordRelay)에서 확인 할 수 있습니다.
