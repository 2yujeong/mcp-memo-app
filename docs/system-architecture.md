# 메모 앱 시스템 아키텍처

## 개요

이 다이어그램은 Next.js 기반 클라이언트 사이드 메모 애플리케이션의 전체 시스템 아키텍처를 보여줍니다. 이 앱은 브라우저의 LocalStorage를 사용하여 데이터를 저장하는 단일 페이지 애플리케이션입니다.

## 시스템 아키텍처 다이어그램

```mermaid
graph TB
    subgraph "브라우저 환경"
        subgraph "프레젠테이션 레이어"
            A[Home Page<br/>page.tsx] --> B[MemoList<br/>컴포넌트]
            A --> C[MemoForm<br/>컴포넌트]
            B --> D[MemoItem<br/>컴포넌트]
            B --> E[MemoViewer<br/>컴포넌트]
            A --> F[Layout<br/>layout.tsx]
        end

        subgraph "비즈니스 로직 레이어"
            G[useMemos Hook<br/>상태 관리 & CRUD]
            H[React State<br/>useState/useEffect]
        end

        subgraph "데이터 액세스 레이어"
            I[localStorage Utils<br/>데이터 액세스]
            J[seedData Utils<br/>초기 데이터]
        end

        subgraph "타입 정의"
            K[Memo Interface<br/>메모 데이터 구조]
            L[MemoFormData<br/>폼 데이터 타입]
            M[MemoCategory<br/>카테고리 타입]
        end

        subgraph "데이터 저장소"
            N[Browser LocalStorage<br/>영구 저장소]
        end
    end

    subgraph "프레임워크 & 라이브러리"
        O[Next.js 15<br/>프레임워크]
        P[React 19<br/>UI 라이브러리]
        Q[TypeScript<br/>타입 시스템]
        R[Tailwind CSS<br/>스타일링]
        S[UUID Library<br/>고유 ID 생성]
    end

    %% 데이터 플로우
    A --> G
    G --> H
    G --> I
    I --> N
    I --> J

    %% 타입 의존성
    G -.->|사용| K
    G -.->|사용| L
    A -.->|사용| K
    A -.->|사용| L
    B -.->|사용| K
    C -.->|사용| L
    D -.->|사용| K
    E -.->|사용| K

    %% 컴포넌트 간 통신
    A -->|props| B
    A -->|props| C
    B -->|props| D
    B -->|props| E
    G -->|데이터 & 함수| A

    %% 프레임워크 의존성
    O -.->|기반| A
    O -.->|기반| F
    P -.->|기반| B
    P -.->|기반| C
    P -.->|기반| D
    P -.->|기반| E
    Q -.->|타입 검사| K
    Q -.->|타입 검사| L
    Q -.->|타입 검사| M
    R -.->|스타일링| A
    R -.->|스타일링| B
    R -.->|스타일링| C
    S -.->|ID 생성| G

    %% 스타일링
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style G fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style I fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style N fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style K fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style O fill:#f1f8e9,stroke:#689f38,stroke-width:2px
```

## 아키텍처 설명

### 1. 프레젠테이션 레이어
- **Home Page**: 애플리케이션의 메인 페이지, 모든 컴포넌트를 조합
- **MemoList**: 메모 목록 표시, 검색 및 필터링 기능
- **MemoForm**: 메모 생성/편집을 위한 모달 폼
- **MemoItem**: 개별 메모 카드 컴포넌트
- **MemoViewer**: 메모 상세 보기 모달
- **Layout**: 애플리케이션 전체 레이아웃

### 2. 비즈니스 로직 레이어
- **useMemos Hook**: 메모 관련 모든 비즈니스 로직 관리
  - CRUD 작업 (생성, 읽기, 업데이트, 삭제)
  - 검색 및 필터링
  - 통계 계산
- **React State**: 컴포넌트 상태 관리

### 3. 데이터 액세스 레이어
- **localStorage Utils**: LocalStorage와의 모든 상호작용 추상화
- **seedData Utils**: 애플리케이션 초기 실행 시 샘플 데이터 제공

### 4. 타입 정의
- **Memo Interface**: 메모 데이터의 구조 정의
- **MemoFormData**: 폼 데이터의 타입 정의
- **MemoCategory**: 메모 카테고리 타입 정의

### 5. 데이터 저장소
- **Browser LocalStorage**: 클라이언트 사이드에서 메모 데이터 영구 저장

### 6. 프레임워크 & 라이브러리
- **Next.js 15**: React 기반 풀스택 프레임워크
- **React 19**: UI 컴포넌트 라이브러리
- **TypeScript**: 정적 타입 검사
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **UUID**: 고유 식별자 생성

## 데이터 플로우

1. 사용자가 UI를 통해 액션 수행
2. 컴포넌트에서 useMemos 훅의 함수 호출
3. useMemos에서 비즈니스 로직 처리
4. localStorage Utils를 통해 데이터 저장/조회
5. LocalStorage에 데이터 영구 저장
6. 상태 업데이트로 UI 리렌더링

## 특징

- **클라이언트 사이드 전용**: 백엔드 서버 없이 동작
- **오프라인 지원**: LocalStorage 사용으로 오프라인에서도 데이터 유지
- **모듈화된 구조**: 각 레이어별로 명확한 책임 분리
- **타입 안전성**: TypeScript를 통한 컴파일 타임 타입 검사
- **반응형 UI**: Tailwind CSS를 활용한 반응형 디자인

## 확장 가능성

향후 백엔드 API 연동 시에는 localStorage Utils를 API 호출 로직으로 교체하는 것만으로도 쉽게 확장 가능한 구조입니다.