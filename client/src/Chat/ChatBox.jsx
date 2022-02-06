import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import Cancel from "@material-ui/icons/Cancel";
import DragIndicator from "@material-ui/icons/DragIndicator";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import socketIOClient from "socket.io-client";
import classnames from "classnames";
import commonUtilites from "../Utilities/common";
import {
    useGetGlobalMessages,
    useSendGlobalMessage,
    useGetConversationMessages,
    useSendConversationMessage,
    useRemoveConversationMessage,
    useRemoveGlobalMessage,
    useUpdateGlobalMessage,
    useUpdateConversationMessage,
} from "../Services/chatService";
import { authenticationService } from "../Services/authenticationService";
import { Menu, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
    },
    headerRow: {
        maxHeight: 60,
        zIndex: 5,
    },
    paper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.palette.primary.dark,
    },
    messageContainer: {
        height: "100%",
        display: "flex",
        alignContent: "flex-end",
    },
    messagesRow: {
        maxHeight: "calc(100vh - 184px)",
        overflowY: "auto",
    },
    newMessageRow: {
        width: "100%",
        padding: theme.spacing(0, 2, 1),
    },
    messageBubble: {
        padding: 10,
        border: "1px solid white",
        backgroundColor: "rgb(195 239 180)",
        borderRadius: "0 10px 10px 10px",
        boxShadow: "-3px 4px 4px 0px rgba(0,0,0,0.08)",
        marginTop: 8,
        maxWidth: "40em",
        wordWrap: "break-word"
    },
    messageBubbleRight: {
        borderRadius: "10px 0 10px 10px",
    },
    inputRow: {
        display: "flex",
        alignItems: "flex-end",
    },
    form: {
        width: "100%",
    },
    avatar: {
        margin: theme.spacing(1, 1.5),
    },
    listItem: {
        display: "flex",
        width: "100%",
    },
    listItemRight: {
        flexDirection: "row-reverse",
    },
    messageMenu: {
        marginTop: "3px"
    },
}));

const ChatBox = (props) => {
    const [currentUserId] = useState(
        authenticationService.currentUserValue.userId
    );
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState(null);
    const [removedMessageId, setRemovedMessageId] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [selectedMessageBody, setSelectedMessageBody] = useState(null);

    const getGlobalMessages = useGetGlobalMessages();
    const sendGlobalMessage = useSendGlobalMessage();
    const updateGlobalMessage = useUpdateGlobalMessage();
    const removeGlobalMessage = useRemoveGlobalMessage();
    const getConversationMessages = useGetConversationMessages();
    const sendConversationMessage = useSendConversationMessage();
    const updateConversationMessage = useUpdateConversationMessage();
    const removeConversationMessage = useRemoveConversationMessage();

    let chatBottom = useRef(null);
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, messageId) => {
        setAnchorEl(event.currentTarget);
        setSelectedMessageId(messageId);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        reloadMessages();
        scrollToBottom();
    }, [lastMessage, removedMessageId, props.scope, props.conversationId]);

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_API_URL);
        socket.on("messages", (data) => setLastMessage(data));
        socket.on("removeMessage", (data) => setRemovedMessageId(data));
    }, []);

    const reloadMessages = () => {
        if (props.scope === "Global Chat") {
            getGlobalMessages().then((res) => {
                setMessages(res);
            });
        } else if (props.scope !== null && props.conversationId !== null) {
            getConversationMessages(props.user._id).then((res) => setMessages(res));
        } else {
            setMessages([]);
        }
    };

    const scrollToBottom = () => {
        chatBottom.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedMessageBody) {
            if (props.scope === "Global Chat") {
                updateGlobalMessage(selectedMessageId, newMessage).then(() => {
                    setNewMessage("");
                    setSelectedMessageBody(null);
                    setSelectedMessageId("");
                });
            } else {
                updateConversationMessage(props.user._id, selectedMessageId, newMessage).then((res) => {
                    setNewMessage("");
                    setSelectedMessageBody(null);
                    setSelectedMessageId("");
                });
            }
        } else {
            if (props.scope === "Global Chat") {
                sendGlobalMessage(newMessage).then(() => {
                    setNewMessage("");
                });
            } else {
                sendConversationMessage(props.user._id, newMessage).then((res) => {
                    setNewMessage("");
                });
            }
        }
    };


    const handleEditMessage = () => {
        setSelectedMessageBody(messages.filter((message) => message._id == selectedMessageId)[0].body);
        setNewMessage(messages.filter((message) => message._id == selectedMessageId)[0].body);
    };



    const handleRemoveMessage = () => {
        if (props.scope === "Global Chat") {
            removeGlobalMessage(selectedMessageId).then((res) => {
                console.log(res)
            });
        } else {
            removeConversationMessage(selectedMessageId).then((res) => {
                console.log(res)
            });
        }
        setSelectedMessageId(null);
    };



    const handleReplyMessage = () => {
    };


    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.headerRow}>
                <Paper className={classes.paper} square elevation={2}>
                    <Typography color="inherit" variant="h6">
                        {props.scope}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.messageContainer}>
                    <Grid item xs={12} className={classes.messagesRow}>
                        {messages && (
                            <List>
                                {messages.map((m) => (
                                    <ListItem
                                        key={m._id}
                                        className={classnames(classes.listItem, {
                                            [`${classes.listItemRight}`]:
                                                m.fromObj[0]._id === currentUserId,
                                        })}
                                        alignItems="flex-start"
                                    >
                                        <ListItemAvatar className={classes.avatar}>
                                            <Avatar>
                                                {commonUtilites.getInitialsFromName(m.fromObj[0].name)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        {m.fromObj[0]._id === currentUserId ?
                                            <IconButton
                                                className={classes.messageMenu}
                                                onClick={(e) => {
                                                    handleClick(e, m._id)
                                                }}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                                <DragIndicator />
                                            </IconButton> : <></>
                                        }
                                        <ListItemText
                                            classes={{
                                                root: classnames(classes.messageBubble, {
                                                    [`${classes.messageBubbleRight}`]:
                                                        m.fromObj[0]._id === currentUserId,
                                                }),
                                            }}
                                            primary={m.fromObj[0] && m.fromObj[0].name}
                                            secondary={<React.Fragment>{m.body}</React.Fragment>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                        <div ref={chatBottom} />
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleEditMessage}>Edit</MenuItem>
                            <MenuItem onClick={handleRemoveMessage}>Delete</MenuItem>
                            <MenuItem onClick={handleClose}>Reply</MenuItem>
                        </Menu>
                    </Grid>
                    <Grid item xs={12} className={classes.inputRow}>
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <Grid
                                container
                                className={classes.newMessageRow}
                                alignItems="flex-end"
                            >
                                <Grid item xs={11}>
                                    <TextField
                                        id="message"
                                        label="Message"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    {
                                        selectedMessageBody ?
                                            <IconButton onClick={(e) => { setSelectedMessageBody(null); setNewMessage("") }}>
                                                <Cancel />
                                            </IconButton> :
                                            <IconButton type="submit">
                                                <SendIcon />
                                            </IconButton>
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ChatBox;
