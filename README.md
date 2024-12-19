<h1 style="text-align: center;">날씨 변화에 따른 전력 사용 예측량</h1>
<img width="1440" alt="스크린샷 2024-12-19 오후 3 37 06" src="https://github.com/user-attachments/assets/2f8581b8-2bec-4005-9ddc-ee1a2864fb05" />
 


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
- [🔎 FE 기술적 도전](#-FE-기술적-도전)
  - [UX 개선](#ux-개선)
- [🔎 BE 기술적 도전](#BE-기술적-도전)
  - [BE 구축](#BE-구축)
    - [Express.js]: 날씨 및 전력 데이터를 입력받고 처리하는 API구성
    - [Fast.api]: Python 기반으로 개발된 고성능 API 서버 프레임워크 
    - [MongoDB]: 날씨 및 전력 데이터를 저장하는 NoSQL 데이터베이스
  - [머신러닝 및 데이터 처리](#머신러닝-및-데이터-처리)
    - [Python]: 데이터 처리 및 머신러닝 모델 개발
    - [Scikit-learn]: 날씨 데이터를 학습하여 전력 사용량을 예측하는 모델 구현
  - [인프라 및 배포](#인프라-및-배포)
    - [GABIA 도메인 구매]: 프로젝트 도메인 설정
    - [NGINX Proxy Manager]: 리버스 프록시 설정, 여러 서비스 연결 및 프록시 관리
    - [CloudFlare]: DNS설정 및 트래픽 보호
    - [Let's Encrypt]: 무료 SSL 인증서 발급 및 HTTPS 설정
    - [Jenkins]: CI/CD 파이프라인 구성으로 테스트 및 배포 자동화

- [🧡 팀원 소개](#-팀원-소개)(
- [팀장]: 20203980 임승진
- [팀원]: 20202979 진동우
- [팀원]: 20202349 박현철

## ✍🏻 프로젝트 개요
> 본 프로젝트는 부산의 월간 날씨를 사용자에게 입력받고, 월간 전력 사용량을 예측하는 서비스를 배포하는것이 목적이다. 
<br />

## 🚀 핵심 기능

### 사용자로부터 날씨를 입력받고 전력 사용량을 예측

> 사용자가 입력할 날씨 정보는 다음과 같다.
- 평균기온(°C)
- 최저기온(°C)
- 최고기온(°C)
- 강수량(mm)
- 습도(%)
- 월(month)

</aside>

### 얘측한 데이터를 AI 분석

> 날씨 정보를 입력하고 전력사용량을 예측한 후
> AI 분석을 실행해보세요.


<div style="display: flex; justify-content: space-around; align-items: center; margin-top: 20px;">
  <img alt="result1" src="https://github.com/user-attachments/assets/c2953434-f7b1-462f-86b2-f07b5727048c" width="45%" />
  <img alt="result2" src="https://github.com/user-attachments/assets/c2bf55c9-6001-4094-8cb9-6168996a9971" width="45%" />
</div>


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


![시스템 아키텍처](https://github.com/user-attachments/assets/51d933ce-407d-4775-afdc-121e3d0e5639)

<br />

## 🔎 FE 기술적 도전

### UX 개선


| 자동배포                                                                                                                    | 도메인과 프록시 관리                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img alt="" src="https://github.com/user-attachments/assets/0084cc15-abe6-40db-b255-dc9871a780c9" /> | <img alt="" src="https://github.com/user-attachments/assets/be4d6275-21d3-4099-9df8-8a5ade61a419" /> |

- Intersection Observer를 사용하여 브라우저 화면에서 현재 보이는 영역을 동적으로 감지하고, 이를 기반으로 **스크롤 이벤트 애니메이션을 설계하고 구현**했습니다. 이를 통해 서비스에 처음 진입했을 때 사용자에게 적절한 맥락을 전달하고, **자연스러운 화면 전환을 제공**하기 위해 노력했습니다.
- 사용자가 입력한 Git 명령어의 동작을 시각적으로 파악할 수 있도록 Git 그래프 변화에 애니메이션을 적용했습니다. D3의 데이터 조인을 이용해 데이터 추가, 수정, 그리고 삭제 애니메이션을 구현했습니다.

<br />

## 🔎 BE 기술적 도전

### 배포 및 도메인 프록시 관리
| 자동배포                                                                                                                    | 도메인과 프록시 관리                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img alt="" src="https://github.com/user-attachments/assets/0084cc15-abe6-40db-b255-dc9871a780c9" /> | <img alt="" src="https://github.com/user-attachments/assets/be4d6275-21d3-4099-9df8-8a5ade61a419" /> |

- GitHub의 Webhooks 이벤트를 활용해 Jenkins가 코드를 빌드 및 배포를 성공적으로 완료하였지만,
**배포 과정에서 배포 완료 상태**를 정확히 인식하지 못하는 문제가 발생하였습니다.
해당 문제로 Jenkins를 테스트 용도로 활용하며 배포 프로세스 최적화에 집중하였습니다.
- Express와 FastAPI 서버는 HTTP로 구성되어 있었으나, 프론트엔드는 HTTPS를 사용하여 통신이 불가능한 문제가 발생하였습니다. 이를 해결하기 위해 Cloudflare와 NGINX Proxy Manager를 활용해 도메인의 DNS, 서브도메인, 그리고 SSL 인증서를 관리하였습니다. 이를 통해 **HTTPS 기반의 프론트엔드**와 백엔드 서비스 통신을 구현하였습니다


<br />

## 🧡 팀원 소개

|                                     임승진                                     |                                     진동우                                      |                                    박현철                                    |                                
| :----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :--------------------------------------------------------------------------: | 
| <img src="https://avatars.githubusercontent.com/u/83889135?v=4" width="120" /> | <img src="https://avatars.githubusercontent.com/u/182656885?v=4" width="120" /> | <img src="https://avatars.githubusercontent.com/u/48150853?v=4" width="120"> |
|                                     **FE**                                     |                                     **BE**                                      |                                    **BE**                                    |                                  
|                    [@seungjin051](https://github.com/seungjin051)                    |                    [@Siper9379](https://github.com/Siper9379)                     |                   [@siri9811](https://github.com/siri9811)                   |

```
