---
title: "Qt 가위바위보(이미지 스프라이트)"
categories: dev
tags: c++
date: '2020-12-19 12:38:00 +0900'
image: /assets/img/dev/QT_RSP.png
---
**소개**<br>
`Image Sprite`를 통해 가위바위보를 구현해보았습니다. **이미지 스프라이트란** 비슷한 성격을 가진 여러 모양의 이미지들 하나의 파일로 제작한 뒤 출력위치를 조정하여 다른 이미지처럼 나타내는 기법입니다.

가위바위보 프로그램에서 필요한 이미지를 http를 통해 받아 스프라이팅 하도록 구현하였습니다.
<!--more-->

* toc
{:toc .large-only}
  
## 구현
**폴더구조**
```coffeescript
src
|-main.cpp
|-SpriteRSP.cpp
|-SpriteRSP.h
|-mainwindow.ui
|-CMakeLists.txt
```
**UI**<br>
UI는 다음과 같이 `QPushButton`3개와 이미지를 출력용 `QLabel`, 승률 출력용 `QLabel`로 구성하였습니다.

![UI](/assets/img/dev/QT_RSP_1.png)

### 헤더파일
클래스 두 개를이용하여 구현하였습니다. 데이터 관리를 위한 `Sprite` 클래스와 Ui출력을 위한 `SpriteRSP`를 이용했습니다.  
```cpp
class Sprite {
public:
    explicit Sprite(QSize winsize, QByteArray data);
    void Draw(QLabel* painter);
    void NextFrame();
    rsc getCurrentFrame() const;
    void addWin() {win++;};
    void addlose() {lose++;};
    void adddraw() {draw++;};
    double getWinRate();
private:
    std::unique_ptr<QPixmap> SpriteImage;
    int CurrentFrame;
    int TotalFrame;
    int Column;
    int FramesizeX;
    int FramesizeY;
    QPoint FramePosition;
    QPoint DrawPosition;
    unsigned int win;
    unsigned int lose;
    unsigned int draw;
    double winRate;
};
```
`Sprite`에서는 이미지 데이터를 이용하여 생성하고, 이미지 데이터 스프라이팅, 승패비김 정보를 관리합니다.

```cpp
class SpriteRSP : public QMainWindow {
Q_OBJECT
public:
    explicit SpriteRSP(QWidget* parent);
    ~SpriteRSP() override;
    void update();
public slots:
    void replyFinished(QNetworkReply* reply);
    void slot_btnClick();
private:
    std::unique_ptr<Ui::SpriteRSP> ui;
    std::unique_ptr<QNetworkAccessManager> m_netwManger;
    std::unique_ptr<Sprite> sprite;
    std::unique_ptr<QTimer> m_timer;
    QVector<QPushButton*> btns;
    bool imageLoading;
};
```
`SpriteRSP` 클래스에서는 메인 UI를 담당합니다. 네트워크를 이용하여 이미지를 받아오고, `sprite` 클래스의 데이터를 이용하여 화면에 출력시켜줍니다.

### 클래스파일
**이미지 받아오기**<br>
이미지 스프라이팅에서 가장 중요한 데이터 가져오는 기능입니다. `QNetworkAccessManger`를 이용하여 `Sprite`를 생성합니다. 
```cpp
SpriteRSP::SpriteRSP(QWidget* parent)
        :m_netwManger(new QNetworkAccessManager(this)),
        ...
        ...
{
    ...
    ...
    //네트워크 이벤트
    connect(m_netwManger.get(), SIGNAL(finished(QNetworkReply*)), this, SLOT(replyFinished(QNetworkReply*)));
    m_netwManger->get(QNetworkRequest(QUrl("http://en.pimg.jp/023/182/267/1/23182267.jpg")));
}

void SpriteRSP::replyFinished(QNetworkReply* reply)
{
    auto data = reply->readAll();
    sprite = std::make_unique<Sprite>(size(), std::move(data));
    imageLoading = true;
}
```
`QNetworkAccessManger`를 이용하여 [URL](http://en.pimg.jp/023/182/267/1/23182267.jpg)에 존재하는 데이터를 응답으로 받습니다.
해당 데이터를 `Sprite`클래스로 보내고 `QPixmap::loadFromData` 메서드를 통하여 Pixmap 이미지로 만들어 저장합니다.

Windows 환경에서 데이터 포맷이 jpg일 경우 loadFromData 메서드가 실패할 수 있습니다. QT 기본 plugin 중 imageformats의 `qjpeg.dll`을 프로젝트에 포함시키면 해결 됩니다. `QImageReader::supportedImageFormats()`을 수행하면 지원가능한 이미지 포맷목록이 출력됩니다.
{:.note title="참고"}

**이미지 스프라이트**<br>
이미지 스프라이트는 `Sprite` 객체에서 구현하였습니다. 이미지를 3개의 프레임으로 분류하고 nextFrame이 호출되면 다음 프레임으로 이동되며 이미지를 crop 시킵니다.
가위, 바위, 보가 있으므로 총 3개의 프레임으로 분류하였습니다.
```cpp
void Sprite::Draw(QLabel* painter)
{
    QRect rect(FramePosition.x(), FramePosition.y(), FramesizeX, FramesizeY);
    QPixmap cropped = SpriteImage->copy(rect);
    painter->setPixmap(cropped); //이미지 출력
}
void Sprite::NextFrame()
{
    if (CurrentFrame>=TotalFrame) CurrentFrame = 0;
    FramePosition.setX((CurrentFrame%Column)*FramesizeX); //스프라이팅 위치 지정
    FramePosition.setY(0);
    CurrentFrame++;
}
SpriteRSP::SpriteRSP(QWidget* parent)
{   
    //타이머를 이용한 반복적인 스프라이팅
    connect(m_timer.get(), &QTimer::timeout, this, &SpriteRSP::update);
    m_timer->start(100);
}
void SpriteRSP::update()
{
    // 이미지 스프라이팅
    sprite->Draw(ui->label);
    sprite->NextFrame();
}
```
스프라이팅된 이미지의 출력은 `SpriteRSP`에서 타이머를 이용하여 구현하였습니다.

**가위바위보 처리**<br>
가위, 바위, 보 버튼을 클릭하면 현재 프레임과 자신이 선택한 버튼을 비교하여 결과 메시지 박스를 출력하는 부분입니다.

<details>
<summary markdown='span'>코드 펼치기/닫기</summary>

```cpp
void SpriteRSP::slot_btnClick()
{
    //imageLoading 안됐을 경우 실패
    if (!imageLoading) return;

    // 타이머 정지, 메시지 박스 => 메시지 확인시에 타이머 다시 기동
    m_timer->stop();

    auto* buttonSender = qobject_cast<QPushButton*>(sender());
//    qDebug() << buttonSender->text();

    const rsc enemyVal = sprite->getCurrentFrame();
    rsc myVal;

    if (buttonSender->text()=="가위") myVal = rsc::SCISSOR;
    else if (buttonSender->text()=="바위") myVal = rsc::ROCK;
    else myVal = rsc::PAPER;

    // 승/패 조건
    if (myVal==enemyVal) {
        if (QMessageBox::information(this, "메시지박스", "비겼습니다")) {
            // 비김 추가
            sprite->adddraw();
            ui->winRate->setText("승률 : "+QString::number(sprite->getWinRate()*100)+"%");
            m_timer->start(100);
        }
    }
    else {
        const int i_myVal = static_cast<int>(myVal);
        const int i_enemyVal = static_cast<int>(enemyVal);

        const int penalty = i_myVal-i_enemyVal;

        if (penalty==-1 || penalty==2) {
            //승
            if (QMessageBox::information(this, "메시지박스", "승")) {
                sprite->addWin();
                ui->winRate->setText("승률 : "+QString::number(sprite->getWinRate()*100)+"%");
                m_timer->start(100);
            }
        }
        else if (penalty==-2 || penalty==1) {
            //패
            if (QMessageBox::information(this, "메시지박스", "패")) {
                sprite->addlose();
                ui->winRate->setText("승률 : "+QString::number(sprite->getWinRate()*100)+"%");
                m_timer->start(100);
            }
        }
    }
}
```
</details>
<br>
이벤트가 일어난 객체를 `auto* buttonSender = qobject_cast<QPushButton*>(sender());` 부분에서 확인할 수 있습니다. 해당 객체의 텍스트를 이용하여 어떤 것을 선택했는지 확인하여 결과창을 출력하고
라벨의 승률을 변경시켜줍니다.

## 결과
![가위바위보](/assets/img/dev/QT_RSP.png)

전체 코드는 [Github](https://github.com/ryanhe4/Qt_Programs/tree/master/SpriteRSP)에서 확인 할 수 있습니다.
