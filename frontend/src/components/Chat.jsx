import { useEffect, useState } from 'react'
import { CardContent, Card, Button, Icon, Container, FormField, Form, Input, Message, MessageHeader, Divider } from 'semantic-ui-react'

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState("")
    const [messagesList, setMessagesList] = useState([])

    const sendMessage = async () => {
        if (username && currentMessage) {
            const info = {
                message: currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit("send_message", info)

            setMessagesList((list) => [...list, info])
        }
    }

    useEffect(() => {
        const messageHandle = (data) => {
            setMessagesList((list) => [...list, data])
        }
        socket.on("recieve_message", messageHandle)

        return () => socket.off("recieve_message", messageHandle)

    }, [socket])

    return (
        <Container>
            <Card fluid>
                <CardContent header={`Chat en vivo | Sala: ${room}`} />
                <CardContent style={{ minHeight: "300px"}}>
                    {messagesList.map((item, i) => {
                        return (
                            <span key={i}>
                                <Message
                                style={{textAlign:  username === item.author ? 'right' : 'left'}} 
                                success={username === item.author} 
                                info ={username !== item.author}>
                                    <MessageHeader>{item.message}</MessageHeader>
                                    <p>Enviado por: <strong>{item.author}</strong>, a las <i>{item.time}</i></p>
                                    
                                </Message>
                                <Divider></Divider>
                            </span>
                        )
                    })

                    }
                </CardContent>
                <CardContent extra>
                    <Form>
                        <FormField>
                            <Input action={{
                                color: 'teal',
                                labelPosition: 'right',
                                icon: 'send',
                                content: 'Send',
                                onClick: sendMessage
                            }}
                                type="text" placeholder='Mensaje...' 
                                onChange={e => setCurrentMessage(e.target.value)} />
                        </FormField>
                        <Icon name='user' />4 Friends
                    </Form>

                </CardContent>
            </Card>
        </Container>
    )
}

export default Chat