import useHandleResponse from "../Utilities/handle-response";
import authHeader from "../Utilities/auth-header";
import { useSnackbar } from "notistack";

// Receive global messages
export function useGetGlobalMessages() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const getGlobalMessages = () => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/global`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar("Could not load Global Chat", {
          variant: "error",
        })
      );
  };

  return getGlobalMessages;
}

// Send a global message
export function useSendGlobalMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendGlobalMessage = (body) => {
    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ body: body, global: true }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/global`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could send message", {
          variant: "error",
        });
      });
  };

  return sendGlobalMessage;
}

// Update a global message
export function useUpdateGlobalMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const updateGlobalMessage = (messageId, body) => {
    const requestOptions = {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({ messageId: messageId, body: body, global: true }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/global`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could send message", {
          variant: "error",
        });
      });
  };

  return updateGlobalMessage;
}

// Get list of users conversations
export function useGetConversations() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const getConversations = () => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/conversations`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar("Could not load chats", {
          variant: "error",
        })
      );
  };

  return getConversations;
}

// get conversation messages based on
// to and from id's
export function useGetConversationMessages() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  const getConversationMessages = (id) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/conversations/query?userId=${id}`,
      requestOptions
    )
      .then(handleResponse)
      .catch(() =>
        enqueueSnackbar("Could not load chats", {
          variant: "error",
        })
      );
  };

  return getConversationMessages;
}

export function useSendConversationMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const sendConversationMessage = (id, body) => {
    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ to: id, body: body }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could send message", {
          variant: "error",
        });
      });
  };

  return sendConversationMessage;
}

export function useUpdateConversationMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const updateConversationMessage = (id, selectedMessageId, body) => {
    const requestOptions = {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({ to: id, messageId: selectedMessageId, body: body }),
    };

    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could update message", {
          variant: "error",
        });
      });
  };

  return updateConversationMessage;
}

export function useRemoveGlobalMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const removeConversationMessage = (id) => {
    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ id: id }),
    };
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/removeGlobalMessage`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could send message", {
          variant: "error",
        });
      });
  };

  return removeConversationMessage;
}

export function useRemoveConversationMessage() {
  const { enqueueSnackbar } = useSnackbar();
  const handleResponse = useHandleResponse();

  const removeConversationMessage = (id) => {
    const requestOptions = {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ id: id }),
    };
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/messages/removeMessage`,
      requestOptions
    )
      .then(handleResponse)
      .catch((err) => {
        console.log(err);
        enqueueSnackbar("Could send message", {
          variant: "error",
        });
      });
  };

  return removeConversationMessage;
}
