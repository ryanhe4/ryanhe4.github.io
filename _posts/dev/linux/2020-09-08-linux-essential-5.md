---
layout: post 
title: "Linux 기본 명령어 5"
date: 2020-09-08 09:32:00 +0900
categories: dev
tags: linux 
---
리눅스 명령어 정리 입니다.
`find 명령어`, `압축 명령어`, `아카이빙명령어`, `쉘의 특성`

<!--more-->

* toc label
{:toc}

## find CMD
검색을 위한 명령어

~~~console
# find / -name core -type [f|d]    (# find / -name "*oracle*" -type f) 
# find / -user user01 -group class1 
# find / -mtime [-7|7|+7]   // 수정 시간으로 검색
# find / -perm [-755|755]   // 파일 권한으로 검색 
# find / -size [-300M|300M|+300M]   // 파일 크기로 검색
# find / -name core -type f -exec rm {} \;  //중요, 세미콜론으로 끝내야함
~~~
>-name [core] 옵션

이름으로 검색하는 방식


>-mtime 옵션

시간으로검색 -7, 7, +7 가능
* 7은 정확히 그 날짜 생성 파일
* +7은 7일 이전 생성파일 , `가장 오래된파일`
* -7은 7일 이후 생성파일, `가장 최근파일`

>-perm 옵션

**권한으로 검색가능**<br>
* +는 보다 `높은 권한`
* -는 보다 `낮은 권한`
* 부호가 아무것도 없으면 정확히 그 권한 

>-size 옵션

**파일 크기로 검색**<br>

* +는 보다 `높은 크기`
* -는 보다 `낮은 크기`
* 부호가 아무것도 없으면 정확한 크기 검색

>-find + exec

`find 명령어`를 실행 명령어와 같이 사용 가능 
~~~console
# find /etc -type f -exec grep -l PASS_MIN_LEN {} \;
# find /etc -type f | xargs grep -l PASS_MIN_LEN
~~~
~~~console
# find /etc -type f -exec CMD {} \;
# find /etc -type f | xargs CMD
~~~
**오래된로그 삭제(find cmd + crontab)**
~~~console
# find /Log_dir -name "*.log" -type f -mtime +30 -exec rm -f {} \;
~~~
**파일시스템 풀(full)이 발생한 경우**
~~~console
# df -h -T
# du -sk /var
# cd /var ; du -sk * | sort -nr | more
# find /var -type f -size +1G
lsof CMD
~~~
**에러 메세지 검색하기**
* 소스 존재하는 경우<br>
    ~~~console
    # find /source -type f -exec grep -l "에러메세지" {} \; 
    ~~~
* 소스 존재하지 않는 경우<br>
    인터넷 검색을 사용하여 검색

## 압축 관련 명령어
**gzip CMD**<br>
파일을 압축할 때 사용하는 명령어
~~~console
# gzip file1
# gunzip -c file1.gz (gzip -d file1.gz)
# gunzip file1.gz
~~~
**bzip2 CMD**
~~~console
# bzip2 file1
# bunzip2 -c file1.bz2
# bunzip2 file1.bz2
~~~
**xz CMD**
~~~console
# xz file1
# unxz -c file1.bz2
# unxz file1.bz2
~~~

**효율** `gzip` < `bzip2` < `xz`
## 아카이빙 관련 명령어
verbose : 자세하게(detail) <br>
**tar CMD**
## 압축 + 아카이빙 관련 명령어
**tar CMD**
~~~console
# tar cvf file.tar file1 file2
# tar tvf file.tar
# tar xvf file.tar

# tar cvzf file.tar.gz file1 file2
# tar tvzf file.tar.gz
# tar xvzf file.tar.gz

# tar cvjf file.tar.bz2 file1 file2
# tar tvjf file.tar.bz2
# tar xvjf file.tar.bz2

# tar cvJf file.tar.xz file1 file2
# tar tvJf file.tar.xz
# tar xvJf file.tar.xz
~~~
**zip CMD**
* ZIP = 압축 + 아카이빙
* windows zip 툴들과 호환 가능( winzip, 알집 ..)
~~~console
# zip [-r] file.zip file1 file2
# unzip -l file.zip
# unzip file.zip
~~~
**jar CMD(java archive)**
~~~console
# jar cvf file.jar file1 file2
# jar tvf file.jar
# jar xvf file.jar
~~~
**파일의 확장자의 압축/아카이빙 해제 방법**
```js
file.tar.gz  : tar xvzf
file.tar.bz2 : tar xvjf 
file.tar.xz  : tar xvJf
file.zip     : unzip
file.jar     : jar xvf
```
## 쉘의 특성

**리다이렉션(Redirection)**<br>
>fd(파일 기술자)

* 프로세스가 파일을 열때 할당되는 번호
* 프로세스의 열린 파일을 구분할 때 사용하는 식별 번호
* 예약번호 존재(0: stdin,1:stdout,2:stderr)

>입력 리다이렉션(Redirection Stdin)

~~~console
# mail -s "linux2XX: OK" admin@example.com < report.txt
# wall < /etc/MESS/work.txt
~~~
>출력 리다이렉션(Redirection Stdout)

~~~console
# ps -ef | grep httpd | wc -l >> httpd.cnt
~~~
>에러 리다이렉션(Redirection Stderr)

~~~console
# ./script.sh > script.log 2>&1
# ./configure --prefix=/usr/local/apache2 >apche.log 2>&1
$ find / -name core -type f 2>/dev/null
~~~

{:.note title="관리자에게 report 메일 전송하기"}
```console
# mail -s "linux2XX: OK" admin@example.com < report.txt
```
**파이프(Pipe)**
여러가지 커맨드를 연결하여 사용<br>
앞의 출력을 뒤의 입력으로 넣음
~~~console
# CMD | grep rsyslogd
# CMD | CMD
~~~
파이프는 커널메모리 사용

>파이프 + tee CMD

~~~console
# CMD | tee [-a] file.log  // 모니터링
# While true
  do
    CMD | tee -a file.log
    sleep 2
  done
~~~
>여러개의 터미널 화면 공유

~~~console
# script -a /dev/null | tee /dev/pts/# | tee /dev/pts/# ..  //쉘 공유 설정
~~~
**쉘 자체의 기능**
```console
# set -o
# set -o vi         // 옵션 ON
# set +o vi         // 옵션 OFF

# set -o ignoreeof  // Ctrl+D 로그아웃 금지
# set -o noclobber  // overwrite 방지
# set -o vi         // 터미널 기본 편집기를 VI로 설정
```
{:.note title="TAB, TAB TAB 기능"}

**변수(Variable)**
1. 변수종류
    * 지역변수: 현재 쉘에서만 의미가 있는 변수, `# VAR=5`
    * 환경변수: 현재 쉘과 서브쉘에서 의미가 있는 변수, `# export VAR=5` 
    * 특수변수: 특수한 목적을 가지고 있는 미리 선언된 변수, `$$, $?, $!, $0, $1, $#, $*, ...`
1. 변수선언
    * 선언) VAR=5; export VAR
    * 확인) echo $VAR
    * 해제) unset VAR
1. export 의미
    변수가 `환경변수`로 된다<br>
1. 시스템/쉘 환경 변수(set/env)
    * PS1: 쉘프롬프트를 정의할 때 사용하는 변수
    * PS2: <, 추가입력할때 나오는 변수
    * TERM `# export TERM=vt100`
    * LANG `# export LANG=ko_KR.UTF-8`
    * PATH `# export PATH=$PATH:/root/bin` , ($HOME/.bash_profile)
    * HOME, PWD, LONGNAME, USER, UID
    * HISTTIMEFORMAT, `# export HISTTIMEFORMAT="%F %T    "`(/etc/profile)

