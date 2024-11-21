import { useEffect, useState } from "react";
import RestClient from "../../client-api/rest-client";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
    const { verify_token } = useParams();
    const [result, setResult] = useState("");

    useEffect(() => {
        const fetchVerifyEmail = async () => {
            const restClient = new RestClient();
            const response = await restClient
                .service('verify-email') // Đặt đường dẫn API
                .patch({
                    token: verify_token,
                })
            setResult(response);
        }
        fetchVerifyEmail();
    }, [])
    return (
        <div>{result}</div>
    )
}

export default VerifyEmail;