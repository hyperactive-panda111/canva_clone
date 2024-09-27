import { useSubscriptionModal } from "../store/use-subscription-modal";

export const usePaywall = () => {
    const subscriptionModal = useSubscriptionModal();

    const shouldBlock = true; //TODO: fetch from API

    return {
        isLoading: false, //TODO: fetch from react-query
        shouldBlock,
        triggerPaywall: () => {
            subscriptionModal.onOpen();
        },
    };
};