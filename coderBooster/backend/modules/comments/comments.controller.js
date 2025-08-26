import { getAllComments, postComment, updateComments, deleteComments } from "./comments.model.js";

export const getComent = async (req, res) => {
    const {id_video} =req.params;
    const comments = await getAllComments(id_video);
    res.json(comments)
};

export const createComment = async (req, res) =>{
    const {id_user, id_video, comments} = req.body;
    const newComment = await postComment (id_user, id_video, comments);
    res.json(newComment)
};

export const updateComent = async (req, res) => {
    const {id_comment} = req.params;
    const updateCo = await updateComments (id_comment, req.body);
    res.json(updateCo)
};

export const deleteComment = async (req, res) => {
    const {id_comment} = req.params
    await deleteComments (id_comment)
    res.json({message: "Delete Correct"})
};

