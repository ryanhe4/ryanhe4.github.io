---
layout: post
title: "Windows 서버 관리 1"
date: 2020-10-08 14:47:00 +0900 
categories: study
tags: windows
image: https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
윈도우 기본 명령어 / 기본 기능

<!--more-->

* toc table
{:toc .large-only}

## 단축키 & 명령어

|  커맨드        |   동작        | 비고 |
| ------------- | ----------    |  -----    |
|WIN+pause      | 시스템 창  |              |
|WIN+E          | 윈도우 탐색기 |             |
|CTRL+ALT+DEL   |CTRL+ALT+INSERT |   vm-ware   |
|CTRL+ALT+ENTER | 전체화면 모드 on/off| vm-ware   |
| WIN + R       | 실행 ||
| ALT + F4      | 로그아웃/재부팅/종료 ||
| CTRL + SHIFT + ESC    | 작업관리자 ||
| shell:startup | 사용자 속성  | cmd|
| shell:Appdata  | AppData ||
| shell:System    | System32 ||
{:.stretch-table}

|  커맨드        |   동작        | 비고 |
| ------------- | ----------    |  -----    |
| slmgr.vbs -rearm    | 평가판 기간 연장(180일) ||
| ncpa.cpl      |  네트워크 연결   ||
|gpedit.msc|그룹 정책 편집기||
| control userpasswords2 | 사용자 속성  ||
| msconfig |시스템 구성||
| lusrmgr.msc | 로컬 사용자 및 그룹||
| appwiz.cpl | 프로그램 제거/변경 ||
| compmgmt.msc | 컴퓨터 관리 ||
| diskpart | 디스크 파티션 관리자 ||
| control desktop | 디스플레이 설정||
| firewall.cpl | 방화벽||
| regedit | 레지스트리 편집기||
| service.msc | 서비스||
| mmsys.cpl | 소리 ||
| taskmgr | 작업 관리자 ||
{:.stretch-table}

## Windows PC OS vs Server OS

* Windows 2003: Windows XP
* Windows 2008: Windows 7
* Windows 2012: Windows 8
* Windows 2016: Windows 10

### Windows Server 2012 Edition

* Standard(ServerCore, ServerGUI)
* Enterprise(ServerCore, ServerGUI)
* Datacenter(ServerCore, ServerGUI)

> OS 설치후 작업

* 서버 관리자 종료
* 라이센스 등록 / 연장
* VMware Tools 프로그램 설치
* 네트워크 작업
* 컴퓨터 이름 변경
* **전원옵션**: 디스플레이 끄기 기능 중지
* 해상도
* IE 보안 강화 구성 기능 끄기
* Administrator - 암호 사용 기간 제한 없음 기능 켜기
* Windows 업데이트 기능 끄기

* CTRL + ALT + DEL 사용 안함 기능 사용(그룹 정책 편집기, gpedit.msc)
* 이벤트 추적기 표시 사용안함
* 사용자 암호 자동 입력
* WindAdmin 관리자 추가 및 Administatator 사용안함
*

## 윈도우 부팅 과정

* **F/W** 단계 : POST
* **BootLoader** 단계 : bootmgr.exe -> winloader.exe
* **Kernel** 단계 : ntoskrnl.exe, hal.dll
* Windows SubSystem : wininit.exe, lsass.exe, services.exe, ..

### 실습: 안전모드 부팅

* 부팅과정중 `F8`

```
운영체제 운영 중 msconfig > 부팅 탭 > [v] 안전모드 > 재부팅
```

### 실습: 시작 프로그램
```coffeescript
cmd: shell:startup - 시작 프로그램 폴더 
```

## 사용자 계정과 그룹 계정
* 사용자
* 그룹
    - Administrators
    - Backup Operators
    - Guests
    - Remote Desktop Users
    - Users

### 실습: 사용자 추가    
## 서버 운영을 위한 Windows 사용
* 검색방법 
  - `WIN + F`, `Win + S`
* 색인 기능
  - 기능(Windows Search 서비스) 추가
  - 색인 옵션
* 드라이브 최적화
* 복구 불가능하게 삭제
```coffeescript
C:> cipher /w:c:
```
* 데이터 암호화(certmgr.msc)
  - 파일/ 폴더 암호화 => EFS(Encrytion File System)
  - 드라이브 암호화 => BitLocker
* 암호를 잊어버릴 경우를 대비한 디스크(EX: USB Stick) 생성
  - 암호 재설정 디스크 만들기
* 로컬 보안 정책(사용자 보안 설정, `secpol.msc`)
  - 암호정책
  - 계정 잠금 정책
* 공유 폴더 설정
  - 네트워크 및 공유센터 - 공용 폴더 공유
