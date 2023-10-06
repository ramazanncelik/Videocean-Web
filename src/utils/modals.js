import LoginModal from "@/components/Modal/LoginModal";
import SignupModal from "@/components/Modal/SignupModal";
import ResetPasswordModal from "@/components/Modal/ResetPasswordModal";
import ShareVideoModal from "@/components/Modal/ShareVideoModal";
import ComplaintFormModal from "@/components/Modal/ComplaintFormModal";

const modals = [
    {
        name: 'login-modal',
        element: LoginModal
    }, {
        name: 'signup-modal',
        element: SignupModal
    }, {
        name: 'resetpassword-modal',
        element: ResetPasswordModal
    }, {
        name: 'share-video-modal',
        element: ShareVideoModal
    }, {
        name: 'complaint-form-modal',
        element: ComplaintFormModal
    }
];

export default modals;