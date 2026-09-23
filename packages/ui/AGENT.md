# 화면 조립 레시피

"구인 상세 화면을 만들어 줘" 같은 요청에서 무엇부터 놓아야 하는지 적는다. 컴포넌트 설명은 `llms.txt`와 `docs/<이름>.md`에 있고, 여기는 **화면 유형 4개의 골격**이다. 모바일 우선(320–412px 단일 컬럼)이고, 어드민 화면만 데스크톱 폭을 쓴다.

공통 규칙 넷.

1. 화면 바깥 틀은 `VStack`, 카드 안쪽도 `VStack`/`HStack`이다. 레이아웃용 `div`를 덧대지 않는다.
2. 글씨는 전부 `Text`다. 크기는 `typography`, 색은 `foreground`로 고른다.
3. 세로 간격은 `gap` 토큰 하나로 정한다. 섹션 사이 `250`, 카드 사이 `150`, 카드 안 `100`.
4. 주 동작은 화면당 하나다. 나머지는 `variant="outline"` 또는 `ghost`.

## 1. 목록 화면 (구인 목록, 내 세션)

필터 → 개수 → 카드 목록 → 페이지 이동. 빈 상태를 반드시 같이 만든다.

```tsx
<VStack gap="150" className="px-200 py-150">
  <SegmentedControl.Root value={status} onValueChange={setStatus} aria-label="구인 상태">
    <SegmentedControl.Item value="all">전체</SegmentedControl.Item>
    <SegmentedControl.Item value="open">모집 중</SegmentedControl.Item>
    <SegmentedControl.Item value="waiting">대기 접수 중</SegmentedControl.Item>
    <SegmentedControl.Item value="closed">마감</SegmentedControl.Item>
  </SegmentedControl.Root>

  <HStack justify="between" align="baseline">
    <Text typography="body4" foreground="muted" numeric>
      {games.length}건
    </Text>
    <Text typography="body4" foreground="muted">
      최신순
    </Text>
  </HStack>

  {games.map((game) => (
    <Card.Root key={game.id} interactive padding="md">
      <Card.Header>
        <Text typography="heading3" truncate>
          {game.title}
        </Text>
        <Badge colorPalette="primary">모집 중</Badge>
      </Card.Header>
      <Card.Body>
        <VStack gap="050">
          <Text typography="body4" foreground="muted">
            {game.system} · {game.duration}
          </Text>
          <HStack gap="100" align="center">
            <AvatarGroup people={game.players} max={4} size="sm" />
            <Text typography="body4" foreground="hint" numeric>
              정원 {game.seats}명 중 {game.applied}명
            </Text>
          </HStack>
          <Progress value={game.applied} max={game.seats} />
        </VStack>
      </Card.Body>
    </Card.Root>
  ))}

  <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} />
</VStack>
```

- 카드 전체가 링크면 `Card.Root render={<Link href={…} />}`로 감싸고, 카드 안에 또 버튼을 넣지 않는다.
- 목록이 비면 카드 대신 `Callout.Root`(gray) + 다음 행동 버튼 하나.

## 2. 상세 + 하단 CTA 화면 (구인 상세)

본문은 스크롤하고 주 동작은 바닥에 고정한다. **`FloatingBar.Spacer`를 빼먹지 않는다.**

```tsx
<FloatingBar.Root>
  <VStack gap="250" className="px-200 py-150">
    <VStack gap="100">
      <HStack gap="100" align="center">
        <Badge colorPalette="primary">모집 중</Badge>
        <Text typography="body4" foreground="warning">
          마감 D-2
        </Text>
      </HStack>
      <Text typography="heading2" render={<h1 />}>
        달빛 여관의 실종자
      </Text>
      <Text typography="body4" foreground="muted">
        CoC 7판 · 4시간 예정 · 온라인
      </Text>
    </VStack>

    <Card.Root background="subtle" padding="md">
      <VStack gap="075">
        <Text typography="subtitle2">확정된 일정</Text>
        <Text typography="subtitle1" foreground="successStrong">
          9월 27일 토요일 오후 7시
        </Text>
      </VStack>
    </Card.Root>

    <Callout.Root colorPalette="notice" variant="outline">
      <Callout.Icon />
      <Callout.Title>트리거 안내</Callout.Title>
      <Callout.Description>공포·유혈 묘사가 있습니다.</Callout.Description>
    </Callout.Root>

    <FloatingBar.Spacer />
  </VStack>

  <FloatingBar.Content>
    <Button size="lg" className="w-full">
      참가 신청하기
    </Button>
  </FloatingBar.Content>
</FloatingBar.Root>
```

- 되돌릴 수 없는 동작(구인 취소, 참여자 내보내기)은 바로 실행하지 말고 `AlertDialog`로 한 번 묻는다.
- 결과 알림은 `toast.success` / `toast.danger`. 실패가 화면을 못 쓰게 만드는 것이면 토스트 말고 화면 안 `Callout.Root colorPalette="danger"`.

## 3. 폼 화면 (구인 등록·수정, 프로필)

`Field.Root`가 라벨·설명·오류를 묶는다. 오류는 토스트가 아니라 필드 아래에 둔다.

```tsx
<VStack gap="200" className="px-200 py-150">
  <Field.Root label="구인 제목" required error={errors.title?.message}>
    <TextInput
      invalid={Boolean(errors.title)}
      placeholder="예: 크툴루의 부름 7판"
      {...register("title")}
    />
  </Field.Root>

  <Field.Root label="시놉시스" description="20자 이상 적어 주세요" counter={`${body.length}/500`}>
    <Textarea rows={5} {...register("body")} />
  </Field.Root>

  <Field.Root label="모집 방식">
    <RadioGroup value={method} onValueChange={setMethod} className="flex flex-col gap-100">
      <RadioCard.Root value="first">
        <RadioCard.Title>선착순</RadioCard.Title>
        <RadioCard.Description>신청 순서대로 자리가 찹니다.</RadioCard.Description>
        <RadioCard.Indicator />
      </RadioCard.Root>
      <RadioCard.Root value="lottery">
        <RadioCard.Title>추첨</RadioCard.Title>
        <RadioCard.Description>마감 뒤 GM이 추첨합니다.</RadioCard.Description>
        <RadioCard.Indicator />
      </RadioCard.Root>
    </RadioGroup>
  </Field.Root>

  <Field.Root label="정원">
    <Stepper value={seats} onChange={setSeats} min={1} max={8} aria-label="정원" />
  </Field.Root>

  <Switch.Root checked={waitlist} onCheckedChange={setWaitlist}>
    <Switch.Control />
    <Switch.Label>대기 접수 받기</Switch.Label>
  </Switch.Root>

  <Button size="lg" className="w-full" loading={pending}>
    구인 등록하기
  </Button>
</VStack>
```

- 바로 적용되는 설정에만 `Switch`를 쓴다. 저장 버튼이 있는 폼의 참·거짓은 `Checkbox`.
- 선택지에 설명이 붙으면 `RadioCard`, 한 줄이면 `Radio`.

## 4. 조율 시트 (일정 고르기, 참여자 메뉴)

시트는 제목 → 본문(스크롤) → 바닥 동작 순서다. 시트 안에서 또 시트나 다이얼로그를 열지 않는다.

```tsx
<Sheet.Root open={open} onOpenChange={setOpen}>
  <Sheet.Popup>
    <Sheet.Handle />
    <Sheet.Header>
      <Sheet.Title>일정 조율</Sheet.Title>
    </Sheet.Header>
    <Sheet.Body>
      {slots.map((slot) => (
        <Sheet.Item key={slot.id} onClick={() => pick(slot)}>
          <Text>{slot.label}</Text>
          <Text typography="body4" foreground="hint" numeric>
            {slot.count}명 가능
          </Text>
        </Sheet.Item>
      ))}
    </Sheet.Body>
    <Sheet.Footer>
      <Button onClick={confirm}>이 시간으로 확정하기</Button>
      <Sheet.Close render={<Button variant="outline" />}>닫기</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Popup>
</Sheet.Root>
```

- 선택지가 3개 이하이고 바로 답하는 물음이면 시트 대신 `Dialog`.
- 다음 단계가 필요하면 시트를 겹치지 말고 `Sheet.Body`의 내용을 바꾼다.
- 시트가 열려 있는 동안 `FloatingBar`는 스스로 숨는다. 따로 끌 필요가 없다.

## 어드민(데스크톱) 화면

목록은 카드 대신 `Table`을 쓴다. 행 전체가 상세로 가는 표는 `Table.Row interactive`, 고른 행은 `selected`. 숫자 칸은 `Table.Cell numeric align="end"`. 좁은 화면에서는 표만 가로로 스크롤한다.
