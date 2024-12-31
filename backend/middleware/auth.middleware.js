import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    // console.log(token);
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();


  } catch (error) {
    // console.log(error);
    return res.status(401).json({ error: "Unauthorized User" });
  }
};