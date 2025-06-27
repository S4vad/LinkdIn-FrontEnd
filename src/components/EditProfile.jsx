import { RxCross1 } from "react-icons/rx";
import { FiCamera, FiPlus } from "react-icons/fi";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../context/UserContext";
import dp from "../assets/dp.jpeg";
import axios from "axios";

export const EditProfile = () => {
  let { setEdit, userData, setUserData } = useContext(UserContext);
  let [skills, setSkills] = useState(userData.skills || []);
  let [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    userName: userData.userName,
    location: userData.location,
    headline: userData.headline,
    gender: userData.gender,
  });
  let [newSkill, setNewSkill] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({
    collage: "",
    degree: "",
    fieldOfStudy: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  let [frontEndProfileImage, setFrontEndProfileImage] = useState(
    userData.profileImage || dp
  );
  let [backEndProfileImage, setBackEndProfileImage] = useState(null);
  let [frontEndCoverImage, setFrontEndCoverImage] = useState(
    userData.coverImage || null
  );
  let [backEndCoverImage, setBackEndCoverImage] = useState(null);
  let [loading,setLoading] =useState(false);

  const profileImage = useRef();
  const coverImage = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // skills
  const handleSkillAdd = (e) => {
    e.preventDefault();
    if (!newSkill?.trim()) return;
    setSkills([...skills, newSkill]);
    console.log("the skils is ", skills);
    setNewSkill("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((sk) => sk !== skill));
  };

  // education
  const handleEducationChanges = (e) => {
    const { name, value } = e.target;
    setNewEducation({ ...newEducation, [name]: value });
  };
  const handleEducation = (e) => {
    e.preventDefault();
    const { collage, degree, fieldOfStudy } = newEducation;
    if (!collage || !degree || !fieldOfStudy) return;
    setEducation([...education, newEducation]);
    setNewEducation({ collage: "", degree: "", fieldOfStudy: "" });
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // experience
  const handleExperienceChanges = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };
  const handleExperience = (e) => {
    e.preventDefault();
    const { title, company, description } = newExperience;
    if (!title || !company || !description) return;
    setExperience([...experience, newExperience]);
    setNewExperience({ title: "", company: "", description: "" });
  };
  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleProfileImage = (e) => {
    let file = e.target.files[0];
    setFrontEndProfileImage(URL.createObjectURL(file));
    setBackEndProfileImage(file);
  };

  const handleCoverImage = (e) => {
    let file = e.target.files[0];
    setFrontEndCoverImage(URL.createObjectURL(file));
    setBackEndCoverImage(file);
  };

  // update profile
  const updataProfileData = async () => {
    setLoading(true)
    try {
      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("userName", formData.userName);
      data.append("location", formData.location);
      data.append("headline", formData.headline);
      data.append("gender", formData.gender);

      data.append("skills", JSON.stringify(skills));
      data.append("education", JSON.stringify(education));
      data.append("experience", JSON.stringify(experience));

      if (backEndProfileImage) {
        data.append("profileImage", backEndProfileImage);
      }
      if (backEndCoverImage) {
        data.append("coverImage", backEndCoverImage);
      }

      const response = await axios.put("/api/user/updateProfile", data);
      console.log(response.data)
      if (response.status === 200) {
        console.log("updated profile successfully");
        setUserData(response.data.data); 
        setEdit(false)
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };



  return (
    <div className="w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
      <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
      <input
        type="file"
        accept="image/*"
        ref={profileImage}
        onChange={handleProfileImage}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={coverImage}
        onChange={handleCoverImage}
        className="hidden"
      />

      <div className="w-[90%] max-w-[500px] h-[600px] bg-white relative overflow-auto z-[200] shadow-lg rounded-lg p-[18px]">
        <div
          className="absolute top-[20px] right-[20px] cursor-pointer"
          onClick={() => setEdit(false)}
        >
          <RxCross1 className="w-[25px] h-[25px] text-gray-800 font-bold" />
        </div>

        <div
          className="w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden cursor-pointer"
          onClick={() => coverImage.current.click()}
        >
          {frontEndCoverImage && (
            <img
              src={frontEndCoverImage}
              alt="cover"
              className="w-full h-full object-cover"
            />
          )}

          <FiCamera className="absolute right-[20px] top-[60px] w-[25px] text-white " />
        </div>

        <div
          className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] cursor-pointer"
          onClick={() => profileImage.current.click()}
        >
          <img
            src={frontEndProfileImage}
            alt="profileimage"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[198px] left-[97px] rounded-full flex justify-center items-center cursor-pointer">
          <FiPlus className="text-white" />
        </div>

        <form className="w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="firstName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="lastName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="userName"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            type="text"
            name="headline"
            value={formData.headline}
            onChange={handleInputChange}
            placeholder="headline"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="location"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            placeholder="gender (male/female/other)"
            className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
          />

          {/* Skills */}

          <div className="w-full">
            <h1 className="text-lg font-semibold mb-2">skils</h1>
            {skills.map((skill, index) => (
              <div
                className="bg-slate-300 w-full mb-2 py-2 px-4 font-semibold text-md rounded-md flex items-center justify-between"
                key={index}
              >
                {skill}
                <RxCross1
                  className="text-xs font-semibold cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </div>
            ))}
            <input
              type="text"
              placeholder="skill....."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <button
              className="w-full h-[40px] rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff]  my-[20px] cursor-pointer flex items-center justify-center gap-2"
              onClick={(e) => handleSkillAdd(e)}
            >
              Add skill
            </button>
          </div>

          {/* Education section*/}
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg font-semibold mb-2">Education</h1>
            {education.map((edu, index) => (
              <div
                className="bg-slate-300 w-full  py-2 px-4 font-semibold text-md rounded-md flex flex-col gap-1 relative"
                key={index}
              >
                <RxCross1
                  className="text-sm font-semibold cursor-pointer absolute right-3 top-3"
                  onClick={() => removeEducation(index)}
                />
                <span>Collage : {edu.collage}</span>
                <span>Degree : {edu.degree}</span>
                <span>Fiel of study : {edu.fieldOfStudy}</span>
              </div>
            ))}
            <input
              type="text"
              placeholder="collage..."
              value={newEducation.collage}
              name="collage"
              onChange={(e) => handleEducationChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="degree..."
              value={newEducation.degree}
              name="degree"
              onChange={(e) => handleEducationChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="field of study..."
              value={newEducation.fieldOfStudy}
              name="fieldOfStudy"
              onChange={(e) => handleEducationChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <button
              className="w-full h-[40px] rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff]  my-[10px] cursor-pointer flex items-center justify-center gap-2"
              onClick={(e) => handleEducation(e)}
            >
              Add education
            </button>
          </div>

          {/* experience */}
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg font-semibold mb-2">Experience</h1>
            {experience.map((exp, index) => (
              <div
                className="bg-slate-300 w-full  py-2 px-4 font-semibold text-md rounded-md flex flex-col gap-1 relative"
                key={index}
              >
                <RxCross1
                  className="text-sm font-semibold cursor-pointer absolute right-3 top-3"
                  onClick={() => removeExperience(index)}
                />
                <span>Title : {exp.title}</span>
                <span>Company : {exp.company}</span>
                <span>Description : {exp.description}</span>
              </div>
            ))}
            <input
              type="text"
              placeholder="title..."
              value={newExperience.title}
              name="title"
              onChange={(e) => handleExperienceChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="company..."
              value={newExperience.company}
              name="company"
              onChange={(e) => handleExperienceChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="description..."
              value={newExperience.description}
              name="description"
              onChange={(e) => handleExperienceChanges(e)}
              className="w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg"
            />
            <button
              className="w-full h-[40px] rounded-full border-2 border-[#2dc0ff] bg-white text-[#2dc0ff]  my-[10px] cursor-pointer flex items-center justify-center gap-2"
              onClick={(e) => handleExperience(e)}
            >
              Add experience
            </button>
          </div>
        </form>
        <button
          className="w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white cursor-pointer"
          onClick={updataProfileData}
          disabled={loading}
        >
          {loading?"updating profile.....":"Save profile"}
        </button>
      </div>
    </div>
  );
};
