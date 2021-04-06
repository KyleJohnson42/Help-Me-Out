
import React, { Component } from 'react';
import Talk from "talkjs";
import DummyUser from '../../../server/database/data/sampleUser.json';
import DummyFeed from '../../../server/database/data/sampleFeed.json';

class MessageButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { user = DummyUser, otherUser = DummyFeed[3] } = this.props;
    Talk.ready
      .then(() => {
          user.id = user._id;
          user.role = 'member';
          const me = new Talk.User(user);
          otherUser.id = otherUser._id;
          otherUser.role = 'member';
          const other = new Talk.User(otherUser);

          if (!window.talkSession) {
              window.talkSession = new Talk.Session({
                  appId: "tsdPQIUx",
                  me,
              });
          }

          const conversationId = Talk.oneOnOneId(me, other);
          const conversation = window.talkSession.getOrCreateConversation(conversationId);

          conversation.setParticipant(me);
          conversation.setParticipant(other);

          this.chatbox = window.talkSession.createChatbox(conversation);
          this.chatbox.mount(this.container);
      })
      .catch(e => console.error(e));
  }

  render() {
    return (
    <>
      <button onClick={this.handleClick}>Message</button>

      <div className="chatbox-container" ref={c => this.container = c} />
    </>
    )
  }
};

export default MessageButton;