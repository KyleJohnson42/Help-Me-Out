import React from "react";
import axios from "axios";
import EditPhotoDisplay from "./EditPhotoDisplay";
import hf from "./helperFunctions";

class AddToolForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tool_name: "",
      help: false,
      tool_photos: [],
      photo_previews: [],
    };

    this.handleGetFields = this.handleGetFields.bind(this);
    this.handleAddToolToToolList = this.handleAddToolToToolList.bind(this);
    this.handleToggleHelp = this.handleToggleHelp.bind(this);
    this.handleAddToolPhoto = this.handleAddToolPhoto.bind(this);
    this.handleDeleteToolPhoto = this.handleDeleteToolPhoto.bind(this);
  }

  handleGetFields(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleToggleHelp() {
    const { help } = this.state;
    this.setState({ help: !help });
  }

  handleAddToolPhoto(e) {
    e.preventDefault();
    const { tool_photos, photo_previews } = this.state;
    let photo = e.target.files[0];
    let preview = URL.createObjectURL(photo);
    let revisedPhotos = tool_photos.concat(photo);
    let revisedPreviews = photo_previews.concat(preview);
    this.setState({
      tool_photos: revisedPhotos,
      photo_previews: revisedPreviews,
    });
  }

  handleDeleteToolPhoto(photoIndex) {
    const { tool_photos, photo_previews } = this.state;
    photoIndex = parseInt(photoIndex);
    let revisedPhotos = [];
    let revisedPreviews = [];
    for (let i = 0; i < tool_photos.length; i++) {
      if (i !== photoIndex) {
        revisedPhotos.push(tool_photos[i]);
        revisedPreviews.push(photo_previews[i]);
      }
    }
    this.setState({
      tool_photos: revisedPhotos,
      photo_previews: revisedPreviews,
    });
  }

  handleAddToolToToolList() {
    const { user_id, toggleAddToolForm } = this.props;
    const { tool_name, tool_photos, help } = this.state;
    const postTool = (photoArray) => {
      let newUserToolObj = {
        tool_name: tool_name,
        tool_photos: photoArray,
        help: help,
      };
      axios
        .post(`/users/${user_id}/tools`, newUserToolObj)
        .then((response) => {
          toggleAddToolForm();
        })
        .catch((err) => {
          throw err;
        });
    };
    hf.cloudinaryUpload(tool_photos, postTool);
  }
  render() {
    const { toggleAddToolForm } = this.props;
    const { tool_photos, photo_previews } = this.state;
    return (
      <div>
        Tool Name:{" "}
        <input type="text" name="tool_name" onChange={this.handleGetFields} />
        <br />
        Tool Photo:{" "}
        <input
          type="file"
          name="tool_photo"
          onChange={this.handleAddToolPhoto}
          multiple
        />
        <br />
        {tool_photos !== [] && (
          <EditPhotoDisplay
            key={tool_photos}
            photos={photo_previews}
            deleteFunction={this.handleDeleteToolPhoto}
          />
        )}
        Need Help: <input type="checkbox" onChange={this.handleToggleHelp} />
        <br />
        <button onClick={this.handleAddToolToToolList}>Add Tool(s)</button>
        <button onClick={toggleAddToolForm}>Cancel</button>
      </div>
    );
  }
}

export default AddToolForm;
