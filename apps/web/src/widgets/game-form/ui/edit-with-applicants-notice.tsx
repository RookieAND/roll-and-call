import { Text } from "@trpg/ui";

export function EditWithApplicantsNotice({ applicants }: { applicants: number }) {
  return (
    <div className="rounded-500 bg-gray-50 px-175 py-150">
      <Text typography="subtitle2" render={<p />}>
        이미 {applicants}명이 신청했습니다.
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="mt-025">
        바꾼 내용은 저장하면 바로 상세에 반영되고, 디스코드 공지도 다시 올라갑니다.
      </Text>
    </div>
  );
}
