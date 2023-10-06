"use client"
import { useState } from "react";
import SignupForm from "./SignupForm";
import UsageAgreements from "./UsageAgreements";

const SignupModal = ({ close }) => {

    const [usageAgreementsIsVisible, setUsageAgreementsIsVisible] = useState(false)

    const usageAgreementsToggle = async () => {
        setUsageAgreementsIsVisible(!usageAgreementsIsVisible)
    }

    if (!usageAgreementsIsVisible) {
        return (
            <SignupForm close={close} usageAgreementsToggle={usageAgreementsToggle} />
        )
    } else {
        return (
            <UsageAgreements usageAgreementsToggle={usageAgreementsToggle} />
        )
    }
}

export default SignupModal;