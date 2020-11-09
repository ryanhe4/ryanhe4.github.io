---
published: false
categories: study
tag: network
date: '2020-11-09 11:08:00 +0900'
---
네트워크 해킹

<!--more-->

* toc
{:.toc}

## 네트워크 개요
네트워크란? 전송 링크로 연결된 협력하는 통신 노드들의 그룹이다.(ktword.co.kr) 

다음은 네트워크 관련된 유형과 국제표준화 기구, 패킷, 프로토콜이다.
### 네트워크 유형
* LAN
* WAN
* MAN

### 표준화와 네트워크 표준 기구
### 패킷

**기본적인 구조**
* 헤더(Header): 전송 동기화를 위한 클럭 정보를 포함한 소스와 목적이 주소를 가지고 있다.
* 데이터(Data): 페이로드(Payload) 또는 동적 데이터로서 512 bytes ~ 16 KBytes 
* 트레일러(Trailer): CRC(Cyclic Redundancy Check)처럼 패킷의 내용을 입증하는 정보

### 프로토콜(Protocol
프로토콜 = 통신 규약

**기능**
* 각각의 모든 프로토콜은 서로 다른 기능과 목적을 가진다.
* 프로토콜은 1계층 내지 그 이상의 계층에서 동작한다.
* 프로토콜 스택 또는 프로토콜 슈트는 협력하여 동작하기 위한 프로토콜의 묶음이다.
* 대다수 공통적인 프로토콜 스택은 TCP/IP이고 인터넷을 위한 거의 대다수 운영체제에서 사용된다.

## OSI 7 Layer

국제 표준화 기구(ISO)에서 개발한 모델로, 컴퓨터 네트워크 프로토콜 디자인과 통신을 계층으로 나누어 설명하고 있다. 

**계층(Layer)의 종류**
- 1) 물리적 계층(Physical Layer)
- 2) 데이터링크 계층(Datalink Layer)
- 3) 네트워크 계층(Network Layer)
- 4) 전송 계층(Transport Layer)
- 5) 세션 계층(Session Layer)
- 6) 프레젠테이션 계층(Presentation Layer)
- 7) 응용 계층(Application Layer) 

