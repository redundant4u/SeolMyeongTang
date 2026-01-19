const ResponsibilityNotice = () => {
    return (
        <div>
            <details className="mb-6">
                <summary className="cursor-pointer text-sm text-red-700 font-medium">
                    책임 고지 (Responsibility Notice)
                </summary>

                <div className="p-5 rounded-lg border border-red-200 bg-red-50 mt-3 text-sm text-red-800 leading-relaxed space-y-1">
                    <p>
                        본 서비스는 사용자의 요청에 따라 임시 컨테이너 기반 원격 작업 환경을 제공합니다. 해당 환경은
                        세션 종료 시 모든 리소스 및 데이터는 자동으로 삭제될 수 있습니다.
                    </p>

                    <p>
                        이 환경에서 수행되는 모든 작업에 대한 책임은 사용자 본인에게 있으며, 서비스 제공자는 사용자의
                        행위로 발생하는 문제에 대해 책임지지 않습니다.
                    </p>
                    <br />
                    <p>
                        This service provides an ephemeral, container-based remote workspace upon the user's request.
                        All resources and data within this environment may be automatically deleted when the session
                        ends.
                    </p>
                    <p>
                        All activities performed within this environment are solely the responsibility of the user, and
                        the service provider shall not be held liable for any issues arising from the user's actions.
                    </p>
                </div>
            </details>
        </div>
    );
};

export default ResponsibilityNotice;
