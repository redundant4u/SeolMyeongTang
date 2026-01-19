const Notice = () => {
    return (
        <div className="p-5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 leading-relaxed space-y-1 mb-4">
            <p>
                사용자는 최대 4개의 환경을 만들 수 있으며, 각 환경은 10분 간 유지됩니다. 10분 초과 시 데이터는 자동으로
                삭제됩니다.
            </p>
            <p>
                터미널 실행 시 <code>app</code> 권한이 부여되며, <code>root</code> 권한을 획득하실 수 있습니다.{' '}
                <code>root</code> 권한을 획득하기 위한 비밀번호는 app입니다.
            </p>
            <p>
                환경 생성 시 <code>id</code>가 부여되며, 내부 8080번 포트로 포워딩되는
                <code>[id].tunnel.redundant4u.com</code> 도메인을 통해 외부에서 접속할 수 있습니다.
            </p>
            <p>서비스를 사용하시기 전 아래의 책임 고지 사항을 반드시 참고하시기 바랍니다.</p>
            <br />
            <p>
                Users can create up to 4 environments. Each environment persists for 10 minutes, and data is
                automatically deleted after 10 minutes.
            </p>
            <p>
                When running the terminal, <code>app</code> permissions are granted, and you can obtain{' '}
                <code>root</code> privileges. The password to obtain <code>root</code> privileges is app.
            </p>
            <p>
                When creating an environment, a <code>id</code> is assigned. You can access it externally via the domain{' '}
                <code>[id].tunnel.redundant4u.com</code>, which forwards to the internal port 8080.
            </p>
            <p>Before using the service, please be sure to review the following responsibility notice.</p>
        </div>
    );
};

export default Notice;
