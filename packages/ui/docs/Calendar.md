---
category: Selection
---

## Props

`Calendar`은 공통 props 중 `className`·`style`만 받는다. 날짜 값은 모두 `YYYY-MM-DD` 문자열이다.

```ts
interface CalendarProps {
  value?: string; // 선택된 날짜. "2026-09-27" 형식
  onSelect: (date: string) => void; // 필수. 날짜를 누르면 그 날짜 문자열을 준다
  min?: string; // 이 날짜보다 이른 날은 누를 수 없다
  max?: string; // 이 날짜보다 늦은 날은 누를 수 없다
  className?: StateClassName<{ value: string | undefined }>; // 함수형 className 가능
  style?: StateStyle<{ value: string | undefined }>;
}
```

열리는 달은 `value`, 없으면 `min`, 그것도 없으면 오늘이 속한 달이다. 이전·다음 달은 헤더 버튼으로 옮긴다.

## 언제 쓰나

세션 날짜, 모집 마감일처럼 달력에서 하루를 고르는 자리에 쓴다. `min`을 오늘로 두면 지난 날짜를 고를 수 없다.

## 쓰지 않을 때

날짜와 시간을 함께 정해야 하는 자리는 날짜 선택 뒤에 시간 입력을 따로 둔다. 정해진 몇 개의 날짜 중 하나만 고를 때는 `Chip`이나 `SegmentedControl`이 더 빠르다.

## 함께 쓰는 것

`Card.Body`나 `Dialog.Body` 안에서 `VStack`과 함께 쓰며, 고른 날짜는 바로 위나 아래 `Text`로 다시 보여준다.

## 예제

```tsx
const [sessionDate, setSessionDate] = useState<string>();

<VStack gap="100">
  <Calendar value={sessionDate} min={todayKey} onSelect={setSessionDate} />
  <Text typography="body4" foreground="muted">
    {sessionDate ? `${sessionDate} 세션으로 구인을 올립니다` : "세션 날짜를 골라 주세요"}
  </Text>
</VStack>;
```

```tsx
<Calendar value={recruitDeadline} min={todayKey} max={sessionDate} onSelect={setRecruitDeadline} />
```

## data-* · 접근성

`data-slot`: `calendar`(Root) · `calendar-header` · `calendar-previous` · `calendar-next` · `calendar-day`. 날짜 버튼에는 `data-selected`(선택됐을 때)와 `data-disabled`(`min`·`max` 밖일 때)가 붙는다.

날짜 버튼은 `aria-label="9월 27일"` 형식이며 `aria-pressed`로 선택 상태를 알린다. 월 표시는 `aria-live="polite"`로 바뀔 때 읽힌다. 화살표 키로 같은 달 안에서 이동하며, 키보드 포커스는 선택된 날짜(없으면 첫 선택 가능 날짜)에 한 번만 머문다.
