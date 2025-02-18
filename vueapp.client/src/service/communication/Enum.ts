enum EnCommandId {
  GQ,
}
enum EnStatus
{
    Idle = 0,       // 0 : 대기 
    Move,           // 1 : 주행중
    Loading,        // 2 : Loading 적재중
    Unloading,      // 3 : Unloading 이재중
    Arrive,         // 4 : 도착
    Loaded,         // 5 : Loaded 적재 완료
    UnLoaded,       // 6 : Unloaded 이재 완료
    Traffic,        // 7 : 트래픽
    Charging,       // 8 : 충전중
    Error,          // 9 : 에러상태
    InitialState,   // 10 : 초기 상태
    Accelerating,   // 11 : 가속중
    Decelerating,   // 12 : 감속중
    SlipOccurrence, // 13 : 슬립 발생
    Turntableing,   // 14 : 턴테이블중
    Docking,        // 15 : 도킹중
    DetailStop,     // 16 : 정밀 정지 상태
    Stop,           // 17 : 정지중
    Standby,        // 18 : Standby 중
    Rotating,       // 19 : 회전중        
    DockingOut,     // 20 : 도킹아웃 중        
    BatterySleep,   // 21 : 배터리 슬립
    RobotSaving,    // 22 : 로봇 자체 세이빙
    MaintaneceMode, // 23 : 메인터넌스모드 동작중
    AwaitAsync,     // 24 : 비동기 액션 동작중
    LiftOrgining,   // 25 : 리프트 오리진중 (리프트 원점 보정)
}

export { EnCommandId, EnStatus }
