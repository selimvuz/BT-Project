import { verify } from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  const secretKey = "ye8zua@8294%qiwommqhfrlu0s7s)be1@-2+9$g$0+3w9i@r3f";

  if (!token) {
    console.error("Unauthorized - Missing token");
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  try {
    const decoded = verify(token.split(" ")[1], secretKey);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired");
      return res
        .status(401)
        .json({ message: "Unauthorized - Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    console.log("Something went wrong");
    return res
      .status(401)
      .json({ message: "Unauthorized - Something went wrong" });
  }
};

export default authenticateToken;
