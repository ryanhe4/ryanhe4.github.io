---
title: "Qt 틱택토"
categories: dev
tags: c++
date: '2020-12-24 17:20:00 +0900'
image: /assets/img/dev/QT_TicTacToe.png
---
**소개**<br>
QT의 `TableWidget`을 이용하여 구현한 틱택토 게임입니다. 틱택토는 3x3화면에서 진행하는 삼목게임 입니다.

QT 틱택토 게임에서 `QTableWidget`을 다루고 `QTimer`의 SingleShot 메소드(Javascript의 `SetTimeout`과 같은 일정 시간 이후 실행되는 함수)를 사용합니다.
<!--more-->

* toc 
{:toc .large-only}
  
## 구현
**폴더구조**
```
src
|-main.cpp
|-MainWindow.cpp
|-MainWindow.h
|-TicTacToe.cpp
|-TicTacToe.h
|-mainwindow.ui
|-CMakeLists.txt
```
`MainWindow`에서 Ui를 담당하고 `TicTacToe`에서 데이터 관리 및 처리를 담당합니다.

**UI**<br>
UI는 아래와 같이 `QTableWidget`과 메시지를 출력하기 위한 `QLabel` 구성하였습니다.

![UI](/assets/img/dev/QT_TicTacToe_2.png)

### MainWindow
**헤더**
```cpp
class MainWindow : public QMainWindow {
Q_OBJECT
public:
    explicit MainWindow(QMainWindow* parent);
    ~MainWindow() override;
public slots:
    void slot_clicked(int row, int col);
private:
    std::unique_ptr<Ui::MainWindow> ui;
    std::unique_ptr<TicTacToe> tic;
    std::vector<std::unique_ptr<QTableWidgetItem>> item;
    int state = 0;

    void settingTable();
    void init();
};
```
Ui 클래스의 헤더 부분입니다. 기본 생성자, 소멸자와 `slot(click)`, 데이터 클래스인 `tic`, 테이블의 WidgetItme 객체인 `item`
그리고 초기화 및 테이블 세팅 함수로 구성됩니다.

**Cpp**
```cpp
void MainWindow::settingTable()
{
    ui->tableWidget->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    ui->tableWidget->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);

    ui->tableWidget->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    ui->tableWidget->verticalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    ui->tableWidget->horizontalHeader()->hide();
    ui->tableWidget->verticalHeader()->hide();
    ui->tableWidget->setRowCount(3);
    ui->tableWidget->setColumnCount(3);

    // QTableWidget 생성 -> 테이블에 할당, 생성된 객체는 소멸자에서 clear() 호출시 일괄 삭제된다.
    for (int i = 0; i<3; i++) {
        for (int j = 0; j<3; j++) {
            auto obj = std::make_unique<QTableWidgetItem>();
            obj->setTextAlignment(Qt::AlignCenter);
            ui->tableWidget->setItem(i, j, obj.get());

            item.emplace_back(std::move(obj));
        }
    }
}
```
우선, Table 기본 정보를 설정하는 settingTable 함수 입니다. 해당함수에서는 크게 2가지 작업을 합니다. 
* 테이블을 3X3의 객체를 만들고, 3X3의 화면을 화면에 맞게 확장
* 3x3으로 만들어진 테이블의 각 셀에 `QTableWidgetItem`을 할당

테이블만 만들면 테이블을 사용할 수 없고, 해당 테이블에 `item객체`를 실제로 할당해주어야 합니다. 반복문을 통해 테이블의 각 row, column에 `item객체`를 할당하였습니다.

테이블을 화면에 맞게 확장할땐 `setSectionResizeMode(QHeaderView::Stretch);`을 사용했습니다.

```cpp
void MainWindow::init()
{
    //Ui데이터 초기화
    for (int i = 0; i<3; i++) {
        for (int j = 0; j<3; j++) {
            ui->tableWidget->item(i, j)->setText("");
            ui->tableWidget->item(i, j)->setBackground(QColor(204, 204, 204));
        }
    }
    ui->label->setText("X의 턴");
    //tic 내부 데이터 초기화
    tic->init();
    state = 0;
}
```
다음은 새로운 게임을 진행하기 위한 초기화 함수 입니다. 여기서도 2가지의 작업을 합니다
* Ui 텍스트 및 색 초기화
* 게임 데이터(tic) 초기화

```cpp
void MainWindow::slot_clicked(int row, int col)
{
    if (state==1) return;

    if (tic->confirmData(row, col).empty()) { //칸에 아무것도 없으면(이전에 클릭이 안됐으면
        QString t = QString::fromUtf8(tic->getTurn().c_str()); // 현재 턴

        tic->setData(row, col);
        ui->tableWidget->item(row, col)->setText(t);

        if (tic->CheckResult()) {
            auto Point = tic->getWinPoint();
            for (auto& elem : Point) {
                ui->tableWidget->item(elem.first, elem.second)->setBackground(QColor(60, 179, 113));
                ui->tableWidget->item(row, col)->setFlags(Qt::ItemIsEnabled);
            }
            ui->label->setText(t+"의 승리! 잠시 후 다시 시작합니다.");
            state = 1;

            QTimer::singleShot(3*1000, this, &MainWindow::init);
        }
        else {
            //TODO 모든칸이 채워졌는지 확인
            if (tic->CheckFull()) {
                ui->label->setText("[비김!] 잠시 후 다시 시작합니다.");
                state = 1;

                QTimer::singleShot(3*1000, this, &MainWindow::init);
            }
            else {
                //TODO 라벨에 턴표시
                tic->toggleTurn();
                t = QString::fromUtf8(tic->getTurn().c_str()); // 현재 턴
                ui->label->setText(t+"의 턴");
                if (t=="O") {
                    auto p = tic->coordinates();
                    qDebug() << p.first << p.second;
                    QTimer::singleShot(1*1000, this, [&, p]() {
                      state = 0;
                      slot_clicked(p.first, p.second);
                    });
                    state = 1;
                }
            }
        }
    }
}
```
* `tic`의 데이터를 확인 하고 설정하면서 게임을 진행하는 셀클릭 슬롯함수(이벤트 리스너) 입니다. 셀클릭 시그널인 [QTableWidget::cellClicked](https://doc.qt.io/qt-5/qtablewidget.html#cellClicked)
가 int 인자 2개(row,column) 이므로 슬롯 클릭함수도 두개의 인자(row, col)을 받습니다.
* `state`는 bool 값으로 클릭가능한지 여부를 나타냅니다. 
* `QTimer::singleShot()`은 타이머의 지정시간 이후 단 한번 요청한 함수를 실행합니다. 인자를 넘길때는 lambda를 사용하는것이 편리합니다.

### TicTacToe
**헤더**
```cpp
class TicTacToe {
public:
    TicTacToe();
    ~TicTacToe();
    void init();

    [[nodiscard]] string getTurn() const { return turn; }
    [[nodiscard]] string confirmData(int row, int col) const { return data[row][col]; }
    void setData(int row, int col);
    void toggleTurn();
    bool CheckResult();
    bool CheckFull();
    [[nodiscard]] vector<std::pair<int,int>> getWinPoint() const;
    std::pair<int, int> coordinates();
private:
    vector<vector<string>> data;
    vector<std::pair<int, int>> winPoint;
    string turn;
};
```
틱택토 클래스의 헤더파일입니다. 해당 클래스는 게임 데이터를 관리하는 클래스 입니다.
* 2차원 벡터 string 데이터
* 승리 포인트
* 현재 턴

위와 같은 데이터를 저장하며 요청에 따라 턴교체, 승리여부 판단, 데이터 변경 등의 메소드를 포함합니다.

**Cpp**
```cpp
bool TicTacToe::CheckResult()
{
    winPoint.clear();

    for (int i = 0; i<3; i++) {
        // 가로라인
        if (data[i][0]==data[i][1] && data[i][1]==data[i][2]
                && !data[i][0].empty() && !data[i][1].empty() && !data[i][2].empty()) {
            winPoint.emplace_back(i, 0);
            winPoint.emplace_back(i, 1);
            winPoint.emplace_back(i, 2);
            return true;
        }
        // 세로라인
        if (data[0][i]==data[1][i] && data[1][i]==data[2][i]
                && !data[0][i].empty() && !data[1][i].empty() && !data[2][i].empty()) {
            winPoint.emplace_back(0, i);
            winPoint.emplace_back(1, i);
            winPoint.emplace_back(2, i);
            return true;
        }
    }
    // 대각선
    if (data[0][0]==data[1][1] && data[1][1]==data[2][2] &&
            !data[0][0].empty() && !data[1][1].empty() && !data[2][2].empty()) {
        winPoint.emplace_back(0, 0);
        winPoint.emplace_back(1, 1);
        winPoint.emplace_back(2, 2);
        return true;
    }
    if (data[0][2]==data[1][1] && data[1][1]==data[2][0]
            && !data[0][2].empty() && !data[1][1].empty() && !data[2][0].empty()) {
        winPoint.emplace_back(0, 2);
        winPoint.emplace_back(1, 1);
        winPoint.emplace_back(2, 0);
        return true;
    }
    return false;
}
```
3x3이라 경우의 수가 적기 때문에 모든 경우를 따져서 승리 여부를 판단했습니다.

승리결과가 존재하는 경우 승리Point(row,col)를 페어로 만들어 반환 합니다. 해당 포인트의 셀은 MainWindow에서 색 변경을 합니다.

## 결과
![틱택토](/assets/img/dev/QT_TicTacToe.png)

전체 코드는 [Github](https://github.com/ryanhe4/Qt_Programs/tree/master/TicTacToe)에서 확인 할 수 있습니다.
