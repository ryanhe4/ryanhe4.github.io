---
title: "Linux 기본 명령어 2"
date: 2020-08-26 09:31:00 +0900
categories: study
tags: linux
description: >
  Linux 기본 명령어 
---
- On this Page
{:toc}
# 시스템 기본 정보
  **1) uname 명령어**
  ```python
  # uname -a  /* 전체 정보 */
  # uname -s	/* 커널 이름 */
  # uname -n	/* 호스트 이름 */
  # uname -r	/* 커널 릴리즈 */
  # uname -sr	/* 커널 이름과 릴리즈 */
  # uname -v	/* 커널 버전 */
  # uname -m	/* 머신 하드웨어 이름 */
  # uname -p	/* CPU 종류 */
  # uname -i	/* 하드웨어 구현 플랫폼 */
  # uname –o 	/* 운영체제 종류 */
  ```
  > 한글 Alt + C 명령어
  
  **운영체제 확인**
  ```
  # lscpu
  # cat/proc/cpuinfo
  ```
  **리눅스 version 확인**
  ```python
  ls /etc/*release
  cat /etc/*release
  ```
  [참고] [레드헷doc](http://docs.redhat.com/)
  
  **2) date 명령어**
  
  시스템 날짜 확인/ 변경(root, 관리자권한)
  ```python
  # date
  # date +%m%d (형식 설정)
  # date 08301300
  # rdate -p|-s time.bora.net
  # date +%m%d -d '-1 days' (날짜 변경 출력)
  # touch file_`date +%m%d`.log (백릿 활용)
  ```
  **3) cal 명령어**
  
  달력 확인
  ```python
  # cal
  # cal 2002
  ```
# 디렉토리 파일관리
 **1) 디렉토리 이동 명령어**
 > pwd CMD (printing working directory)

  ```python
  # cd
  # pwd
  PS1 변수 ( 쉘 프롬프트 출력 담당, gedit ~/.bashrc 수정)
  export PS1='형식' (echo $PS1 참고하여 변경) 
  ```
   
[참고] 홈 디렉토리
  - root 사용자 : /root
  - 일반 사용자 : /home/&USER
     
> cd CMD (Change Working Directory)
  
경로 (PATH)
  - 상대경로 (Relative PATH) ```# cd dir1```
  - 절대경로 (Absolute PATH) ```# cd /dir1```
      
[참고] ~fedora vs ~/fedora 
   
 ```
 # cd ~fedora  // fedora 사용자의 홈디렉토리
 # cd ~/fedora // 나의 홈디렉토리 아래의 fedora 디렉토리
 # cd $HOME
 # cd -        // 이전 디렉토리
 # cd ../dir   // 옆 디렉토리
 ```
> ls CMD
 
  ```
  # ls -l        // 전체 정보 출력 
  # ls -ld dir   // 디렉토리 정보 출력
  # ls -lR /test // 하위디렉토리 까지 출력
  # ls -a        // 숨김파일 까지 출력
  # ls -F        // 다른 파일 타입 표현
  # ls -i        // inode 출력
  # ls -h        // 크기 단위 조정 출력
  # ls -altr     // 생성일 기준 정렬 출력
  ```
   alias : bash 명령어 통한 별칭 설정
   ```python
   ~/.bashrc 수정
   1. alias tree='tree -C'
   2. # source ~/.bashrc 
   ```
> mkdir CMD (폴더 생성)

   ```
   # mkdir -p dir3/dir2/dir1 (parent: 하위폴더 까지 자동 생성)
   # rm -rf dir1 (하위폴더,파일까지 삭제)
   ```
**2) 파일 관리 명령어**
> touch 명령어

 ```
 # touch file2            // 빈 파일 생성
 # touch file1 file2
 # touch -t 08081230 file1 //file1 수정 시간 변경(월,일,시,분)
 ```
 * [참고] stat
   - stat file1
   
 > cp 명령어
 
 파일 복사 명령
 ```
  # cp file1 file2
  # cp file1 dir1
  # cp -r dir1 dir2
  # cp -p source dest  // 유지 permission 값, 생성 시간 등 
  # cp -a source dest  // 속성 유지 + 링크 정보 유지
  OPTIONS: -r, -i -f, -p, -a(rp)
 ```
설정 파일 백업 및 복구
  ```
  # cp -p httpd.conf ttpd.conf.old
  # cp -p httpd.conf.old httpd.conf
  ```
  로그 파일(EXL file.log) 비우기
  ```python
  1. # cp /dev/null file.log 
  2. # cat /dev/null > file.log 
  3. # > file.log 
  ```
> mv CMD (파일 옮기기, rename)

```
# mv file1 file2			/* file1 파일이 이름이 file2로 변함 */
# mv file1 dir1		 	/* file1 파일이 dir1 디렉토리에 하위경로로 이동 */
# mv dir1 dir2			  /* dir1 디렉토리가 dir2 디렉토리에 하위경로로 이동 */
OPTIONS: -i, -f
```
[참고] 와일드 카드 문자: 하나의 문자가 여러개의 문자의 의미를 포함하는 문자
   ```bash
   \* : 0 or more character (except .file) 	(EX) # cp file* dir1)
   ? : one charater                       	(EX) # cp file? dir1)
   { } : 선택적인 하나의 문자열(단어)       	(EX) # cp file{apple,bannar,orange} dir1
   \[\] : 선택적인 하나의 문자		              (EX) # cp file[123] dir1
   # man 7 glob
   ```
  
> rm CMD (파일 제거)

```
# rm file1 
# rm file1 file2
# rm -r dir1     // 하위경로 dir 포함
OPTIONS: -f, -i, -r
```
**3) 파일 내용확인 명령어**
> cat CMD

파일 내용을 화면으로 출력
 ```
 # cat file1
 # cat file1 file2
 # cat -n file1           //줄번포 포함(# nl file)
 # cat file1 file2 > file3
 원하는 내용 추출
 # cat file1 > grep fedora
 ```
> more CMD(less CMD 확장형)

큰 파일을 화면 페이지 단위로 출력
```
# more file1
# rpm -qa | more
# CMD | more
```
> head CMD

 파일의 처음 n 줄을 출력하는 명령어. 주로 다른 명령어와 연계하여 사용
 ```
 # head /etc/passwd (=head -n /etc/passwd)
 # head -n 5 /etc/passwd
 # head -c 10 /etc/passwd //c parameter byte 수 만큼 출력
 alias pps, nstat 등
 ```
> tail CMD

 head 명령어의 반대 형태
 ```
 # tail /etc/passwd
 # tail -f /var/log/messages
 ```
 서버를 실시간으로 모니터링
 ```
 # top                        (# gnome-system-monitor, GUI)
 # tail -f /var/log/messages  (# gnome-system-log, GUI)
 # tail -f /var/log/messages | grep -i DHCP
 # tail -f /var/log/messages | grep -i DNS
 # tail -f /var/log/messages | grep -i oracle
 # tail -f /var/log/messages | grep -i wasuser
 # tail -f /var/log/messages | egrep -i '(warn|error|crit|alert|emerg)'
 ```

**기타 관리용 명령어**
> wc CMD

  데이터 수집(Data Gathering)
  ```bash
  # ps -ef | wc -1
  # ps -ef | grep httpd | wc -1
  # cat /etc/passwd | wc -1
  # rpm -qa | wc -1
  # df -hT -t ext4 / | tail -1 | awk '{print $6}'
  ```
 ```bash
 # cat /var/log/mesages | \\ 
   grep 'Aug 30' | \
   grep 'systemd-logind'| \\   
   grep 'New sessions'| wc -1
  ```