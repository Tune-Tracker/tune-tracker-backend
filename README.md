<div align="center">
  <h1>날씨 변화에 따른 전력 사용 예측량</h1>
  
![Frame 30](https://github.com/boostcampwm2023/web01-GitChallenge/assets/79246447/fe5e7fbd-93fe-40ea-be09-a902b712f6c3)
</div>

<p align=center>
  <a href="https://weather-tracker-frontend.vercel.app/">배포 주소</a>
</p>

<br/>

<p align=center>
  <a href="https://github.com/Weather-Tracker-Project/">깃허브 조직레포</a>
</p>

## 📄 목차

- [📄 목차](#-목차)
- [✍🏻 프로젝트 개요](#-프로젝트-개요)
- ## [🚀 핵심 기능](#-핵심-기능)
- [⚙️ 기술 스택](#️-기술-스택)
- [🏛️ 시스템 아키텍처](#️-시스템-아키텍처)
- [🔎 FE 기술적 도전](#-fe-기술적-도전)
  - [UX 개선](#ux-개선)
- [🔎 BE 기술적 도전](#-be-기술적-도전)
  - [BE 구축](#BE-구축)
    - [Express.js]: 날씨 및 전력 데이터를 입력받고 처리하는 API구성
    - [Fast.api]: Python 기반으로 개발된 고성능 API 서버 프레임워크 
    - [MongoDB]: 날씨 및 전력 데이터를 저장하는 NoSQL 데이터베이스
  -[머신러닝 및 데이터 처리](#-머신러닝-및-데이터-처리)
    - [Python]: 데이터 처리 및 머신러닝 모델 개발
    - [Scikit-learn]: 날씨 데이터를 학습하여 전력 사용량을 예측하는 모델 구현
  -[인프라 및 배포](#-인프라-및-배포)
    - [GABIA 도메인 구매]: 프로젝트 도메인 설정
    - [NGINX Proxy Manager]: 리버스 프록시 설정, 여러 서비스 연결 및 프록시 관리
    - [CloudFlare]: DNS설정 및 트래픽 보호
    - [Let's Encrypt]: 무료 SSL 인증서 발급 및 HTTPS 설정
    - [Jenkins]: CI/CD 파이프라인 구성으로 테스트 및 배포 자동화

- [🧡 팀원 소개](#-팀원-소개)
- [팀장]: 20203980 임승진
- [팀원]: 20202349 박현철
- [팀원]: 20202979 진동우

## ✍🏻 프로젝트 개요

...

<br />

## 🚀 핵심 기능

### 사용자로부터 날씨를 입력받고 전력 사용량을 예측

> 사용자가 입력할 날씨 정보는 다음과 같다.
- 평균기온
- 최저기온
- 최고기온
- 강수량(mm)
- 습도(%)
- 월(month)

</aside>

### 날씨 ~~

> 터미널 환경에서 직접 Git 명령어를 입력하고, vi 편집기를 사용하며
> 문제를 풀어보세요.

<img alt='' src="https://github.com/boostcampwm2023/web01-GitChallenge/assets/96400112/7e89b3f3-6987-4a1e-85d3-d6430aa3ad05" />

## ⚙️ 기술 스택

<table>
    <thead>
        <tr>
            <th>분류</th>
            <th>기술 스택</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <p>공통</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white">
            </td>
        </tr>
        <tr>
            <td>
                  <p>프론트엔드</p>
            </td>
            <td>
                  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=Next.js&logoColor=white" />
            </td>
        </tr>
        <tr>
            <td>
                <p>백엔드</p>
            </td>
            <td>
                <img src="ttps://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white" />
                <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white" />
                <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
                <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi"/>
            </td>
        </tr>
                <tr>
            <td>
                <p>머신러닝</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=Python&logoColor=white"/>
            </td>
        </tr>
                <tr>
            <td>
                <p>배포</p>
            </td>
            <td>
              <img src="https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white"/>
              <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white"/>
            </td>
        </tr>
        <tr>
            <td>
                <p>협업</p>
            </td>
            <td>
                <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white">
            </td>
        </tr>
    </tbody>
</table>

<br />

## 🏛️ 시스템 아키텍처

![시스템 아키텍처](https://github.com/boostcampwm2023/web01-GitChallenge/assets/96400112/d94724b8-a7a7-48e6-bba8-891bc7bfd696)

<br />

## 🔎 FE 기술적 도전

### UX 개선

| 랜딩 페이지                                                                                                                     | Git 그래프 변화                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img alt="" src="https://github.com/boostcampwm2023/web01-GitChallenge/assets/96400112/aae4947d-5782-4a1e-97b5-23c445cbe573" /> | <img alt="" src="https://github.com/boostcampwm2023/web01-GitChallenge/assets/96400112/1ad9a125-1137-4a8d-b5c0-140360a987c4" /> |

- Intersection Observer를 사용하여 브라우저 화면에서 현재 보이는 영역을 동적으로 감지하고, 이를 기반으로 **스크롤 이벤트 애니메이션을 설계하고 구현**했습니다. 이를 통해 서비스에 처음 진입했을 때 사용자에게 적절한 맥락을 전달하고, **자연스러운 화면 전환을 제공**하기 위해 노력했습니다.
- 사용자가 입력한 Git 명령어의 동작을 시각적으로 파악할 수 있도록 Git 그래프 변화에 애니메이션을 적용했습니다. D3의 데이터 조인을 이용해 데이터 추가, 수정, 그리고 삭제 애니메이션을 구현했습니다.

<br />

## 🔎 BE 기술적 도전

### 도커 컨테이너

<img width="50%" alt="docker container" src="https://github.com/boostcampwm2023/web01-GitChallenge/assets/96400112/c59857a3-08e5-49f0-9e8c-bab8a419be3a">

- 사용자별 **격리된** git 문제 풀이 환경을 제공하면서도, git의 전역 설정들이 다른 사용자들에게 영향을 미치지 않도록 하기 위해 도커 컨테이너를 이용했습니다.
- 컨테이너 생성 시간을 아끼고자 각 문제 별로 미리 생성된 컨테이너 환경에 사용자를 할당하고 새로운 컨테이너를 생성합니다.
- 서버 자원을 효율적으로 사용하기 위해 오래 된(30분) 컨테이너는 자동 정리되며 사용자 재접속 시 **log 기반으로 복구**됩니다.
- 네트워크 차단, 실행 가능 명령어 검증, 유저 권한 제한 등으로 사용자의 입력을 검증하고 제한했습니다.

<br />

## 🧡 팀원 소개

|                                     임승진                                     |                                     진동우                                      |                                    박현철                                    |                                
| :----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | 
| <img src="https://avatars.githubusercontent.com/u/83889135?v=4" width="120" /> | <img src="https://avatars.githubusercontent.com/u/182656885?v=4" width="120" /> | <img src="https://avatars.githubusercontent.com/u/48150853?v=4" width="120"> |
|                                     **BE**                                     |                                     **BE**                                      |                                    **FE**                                    |                                  
|                    [@seungjin051](https://github.com/seungjin051)                    |                    [@Siper9379](https://github.com/Siper9379)                     |                   [@siri9811](https://github.com/siri9811)                   |

```
