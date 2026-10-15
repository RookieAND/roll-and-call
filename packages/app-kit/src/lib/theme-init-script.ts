// 그리기 전에 테마를 정해 깜빡임을 막는 인라인 스크립트. 루트 레이아웃과 global-error가 <head>에 넣는다.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}`;
