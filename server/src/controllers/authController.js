const supabase = require("../../config/supabase");
const jwtUtils = require("../utils/jwtUtils");

async function createAccount(req, res) {
  const { email, password, displayName, pfp } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, name: displayName, profile_pic: pfp }])
      .select();
    if (profileErr) {
      return res.status(400).json({ error: profileErr.message });
    }

    const token = jwtUtils.generateToken({ userId: data.user.id });
    const name = displayName;
    const profile_pic = pfp;

    return res.status(201).json({
      message: "Account created successfully",
      token,
      name,
      profile_pic,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id);

    if (profileErr) {
      return res.status(400).json({ error: profileErr.message });
    }

    const token = jwtUtils.generateToken({ userId: data.user.id });
    const name = profile[0].name;
    const profile_pic = profile[0].profile_pic;

    return res.json({ message: "Login successful", token, name, profile_pic });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add functions for password recovery, etc.

module.exports = {
  createAccount,
  login,
  // Add other functions as needed.
};
