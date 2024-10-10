import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import "./styles.css";
import { app } from "@/app/components/Firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const Video = ({
  content,
  setContent,
  item,
  index,
  editting,
  setEditting,
  loading,
  setLoading,
  videoFile,
  setVideoFile,
  posterImage,
  setPosterImage,
}) => {
  const storage = getStorage(app);
  const handleSubmitVideoEdit = async (index) => {
    // Alert if no file is selected
    if (!videoFile && !posterImage) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please select a video or a poster to replace.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
      return;
    }
    setLoading(true); // Show loading spinner during image upload
    try {
      // if a video is selected, upload it to Firebase
      let newVideoUrl;
      if (videoFile) {
        await deleteFromFirebase(content[index].value);
        const videoRef = ref(storage, `videos/${videoFile.name}`);
        await uploadBytes(videoRef, videoFile);
        newVideoUrl = await getDownloadURL(videoRef);
      }
      // If a poster image is selected, upload it to Firebase
      let posterURL;
      if (posterImage) {
        await deleteFromFirebase(content[index].poster);
        const posterRef = ref(storage, `posters/${posterImage.name}`);
        await uploadBytes(posterRef, posterImage);
        posterURL = await getDownloadURL(posterRef);
      }
      // Update the content state with the new video and poster URLs
      const updatedContent = [...content];
      if (videoFile) updatedContent[index].value = newVideoUrl;
      if (posterImage) updatedContent[index].poster = posterURL;
      setContent(updatedContent); // Set the updated content state
      setEditting(null); // Exit editing mode
      setVideoFile(null); // Reset the video file input
      setPosterImage(null); // Reset the poster image input (if any)
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Video has been replaced.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } catch (error) {
      // Show error message in case of failure
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An issue occurred while replacing the video.",
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };
  // Deletes an image from Firebase Storage

  const deleteFromFirebase = async (url) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error("Error deleting element:", error);
    }
  };
  return (
    <>
      <div className="video-container">
        {/* Render the edit or check icon based on whether the component is in editing mode */}
        {editting !== index ? (
          <i
            className="fas fa-edit edit-icon"
            onClick={() => setEditting(index)}
          ></i>
        ) : (
          <i
            className="fas fa-check save-icon"
            onClick={() => setEditting(null)}
          ></i>
        )}
        {/* Render the video and poseter(optional) input if in editing mode */}

        {editting === index ? (
          <div className="edit-video-container">
            <label htmlFor="edit-video" className="custom-file">
              <i className="fas fa-upload"></i>Upload New Video
            </label>
            <input
              id="edit-video"
              type="file"
              className="input-file"
              accept="video/*"
              onChange={(e) => {
                setVideoFile(e.target.files[0]);
              }}
            />
            <label htmlFor="edit-poster" className="custom-file">
              <i className="fas fa-upload"></i>Upload New Poster(Optional)
            </label>
            <input
              id="edit-poster"
              type="file"
              className="input-file"
              accept="image/*"
              onChange={(e) => {
                setPosterImage(e.target.files[0]);
              }}
            />
            <button
              className="submit-button"
              onClick={() => handleSubmitVideoEdit(index)}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
              Save Changes
            </button>
          </div>
        ) : (
          <video className="content-video" controls poster={item.poster}>
            <source src={item.value} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </>
  );
};
export default Video;
