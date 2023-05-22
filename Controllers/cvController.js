const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const ejs = require('ejs');


const Profile = require('../Models/ProfileModel');
const templatePath = path.join(__dirname, '..', 'templates', 'cv-template.ejs');
const template = fs.readFileSync(templatePath, 'utf-8');

const generatePdfFromHtml = async (html) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);

  const pdf = await page.pdf({
    format: 'A4',
    height: '1500px', // Increase the height value as needed
    scale: 0.8 // Adjust the scale value as needed (e.g., 0.8 for a slightly smaller size)
  });
  
  

  await browser.close();

  return pdf;
};

const generateCV = async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Provide the correct path to Chrome executable
    });

    const userId = req.userId;

    // Fetch the user's profile data from the database
    const profile = await Profile.findOne({ userId });

    const data = {
      profilePic: profile.profilePic,
      name: profile.name,
      profile: profile,
      education: profile.education,
      experience: profile.experience,
      address: profile.address,
      age: profile.age,
      about: profile.about
    };
    

    const htmlContent = ejs.render(template, data);

    // Generate PDF from HTML using Puppeteer
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();

    // Send the PDF file as a response
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateCV,
};
