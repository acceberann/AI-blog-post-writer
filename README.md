# AI Blog Post Generation App

## Project Overview
This AI app generates a fully drafted blog post using a structured workflow. It takes a keyword topic as input and produces the draft, SEO meta title, description, excerpt, and allows for user input during the process. The app aims to create content that aligns with the user's brand voice while streamlining the entire blog post creation.

### Core Features:
- **Brand Voice Alignment**: Ensures that the content matches the user's existing style and tone.
- **Outline and Draft Generation**: Produces an organized blog post outline and a complete draft.
- **SEO Optimization**: Includes meta title, meta description, and an engaging excerpt.
- **User Review and Editing**: Allows user input for review and edits at multiple stages.
- **Future Enhancements**: Potential to include text-to-image generation and keyword research tools.

## Workflow and Requirements
### Detailed Workflow:
1. **Brand Voice Collection**
   - Gather user input about brand voice, tone, and style. - completed 10/8/24
2. **Keyword Input and Topic Understanding**
   - AI generates a brief overview and topic outline based on the user's input.
3. **Outline Creation and Approval**
   - User reviews and approves or suggests adjustments to the outline.
4. **Draft Generation**
   - AI writes the draft according to the approved outline.
5. **Draft Review and Editing**
   - User can edit or request changes to the draft.
6. **SEO Meta Title and Description Creation**
   - AI creates and optimizes the meta title and description.
7. **Excerpt Generation**
   - AI generates a summary or engaging excerpt of the blog post.
8. **Final Review and Export**
   - Format the blog post for publishing, ready for download or CMS upload.

## Development Phases
1. **Data Collection**
   - Setting up forms for brand voice and user inputs. - completed 10/8/24
2. **Backend Development**
   - Node.js setup and AI integration. - completed 10/8/24
3. **Frontend Development**
   - React UI with forms for data entry and draft reviews.
4. **Frontend-Backend Connection**
   - Linking the UI to backend API endpoints.
5. **Review Features**
   - Implementing the outline and draft review processes.
6. **Testing and Iteration**
   - Testing the app's functionalities and refining outputs.
7. **Future Enhancements**
   - Planning for text-to-image generation and advanced SEO features.

## Milestones and Deadlines
| Milestone                        | Expected Completion Date |
|----------------------------------|-------------------------|
| Data Collection Setup            | TBD                     |
| Backend Development              | TBD                     |
| Frontend Development             | TBD                     |
| Frontend-Backend Connection      | TBD                     |
| Implement Review Features        | TBD                     |
| Testing and Iteration            | TBD                     |
| Planning Future Enhancements     | TBD                     |

## Project Tracking
- **Current Status**: Initial planning phase.
- **Notes**: Updating requirements as development progresses.

## Future Enhancements
- **Text-to-Image Generation**: Integration of AI tools for generating relevant images.
- **Advanced SEO Features**: Improved keyword analysis and optimization.

**AI Blog Post Writing Tool: Project Scope Document**

### 1. Project Overview
This AI Blog Post Writing Tool aims to guide users through creating fully drafted blog posts based on their keywords. It leverages OpenAI's API to generate outlines, drafts, and refine content through a step-by-step wizard-style UI. The goal is to create an intuitive, user-friendly process that delivers value by simplifying blog creation with the power of AI, ultimately leading to a subscription-based SaaS product.

### 2. Component Breakdown
#### Frontend Components
- **Wizard.js**: Acts as the main container for the entire step-by-step process. It controls navigation between different components representing each stage of blog post generation.
  - **KeywordSelection.js**: Handles input of the initial keyword/topic from the user to begin the blog creation process.
  - **OutlineGeneration.js**: Sends the user's keyword to the backend to generate an outline using the OpenAI API and displays it for user review.
  - **BrandVoiceCheck.js**: Either checks for an existing brand voice profile or guides the user through creating one if it doesn’t exist.
  - **BlogDraftGeneration.js**: Uses the generated outline and brand voice profile to produce the initial draft of the blog post.
  - **HumanReview.js**: Displays the draft for user feedback, allowing them to make changes or approve the draft.
  - **FinalReview.js**: A stage where the user can give final approval to the content, ensuring it meets their expectations.
  - **PublishAndExport.js**: Finalizes the content, allowing users to download it or publish it to a connected platform.

#### Backend
- **index.js**: Contains the backend server logic. Manages requests and responses for generating outlines, creating brand voice profiles, and handling user inputs.
  - **Endpoints**: Detailed below.

### 3. File Structure and Responsibilities
- **/frontend**: Contains all client-side components and CSS files.
  - **Wizard directory**: Holds individual components for each step in the wizard UI.
  - **App.js**: Serves as the entry point for rendering the main Wizard component.
  - **index.css**: Manages the styles for the entire application.
- **/backend/index.js**: The main backend server file. It configures the OpenAI API, handles all API endpoints, manages CORS, and processes the blog-related tasks.

### 4. Endpoints and Functionality
- **/generate-outline**:
  - **Request**: `POST` with `topic` in the body.
  - **Response**: Returns a generated outline for the given topic.
  - **Confirmed in Postman**: Works successfully with the `gpt-3.5-turbo` model, returns structured outlines.
- **/create-brand-voice**:
  - **Request**: Handles multiple stages of creating a brand voice profile based on user responses.
  - **Response**: Either sends the next question or confirms that the profile is complete.
  - **Confirmed in Postman**: Works for collecting and confirming user inputs.

### 5. OpenAI API Settings
- **Version**: `openai@4.67.3`.
- **Configuration**:
  - **Key Setup**: Utilizes `dotenv` to load the OpenAI API key from environment variables.
  - **API Methods**: Uses `createChatCompletion` to interact with the `gpt-3.5-turbo` model for generating content.
  - **Max Tokens**: Typically set to `300` to ensure a detailed response that remains within response length limits.
- **Integration Points**: Called within the `/generate-outline` and draft generation endpoints.

### 6. CORS Setup
- **Library Used**: `cors`.
- **Configuration**: CORS enabled for all routes (`app.use(cors())`). This allows requests from the frontend to the backend server running on different ports during local development.
- **Security Considerations**:
  - Only allow CORS in development, and tighten these settings in production.
  - Specify trusted origins to limit cross-origin access when the app is deployed.

### 7. Security Measures
- **Input Sanitization**: Uses `DOMPurify` in the frontend to sanitize user inputs and prevent HTML injection before sending them to the backend.
- **API Interaction**:
  - Inputs are verified before being sent to OpenAI to avoid passing unintended data.
  - Implemented backend checks to ensure that all inputs are correctly formatted and contain no harmful content.
- **Rate Limiting**: Planned implementation of rate limiting on the backend to prevent abuse of the OpenAI API endpoints.

### 8. User Flow
1. **Keyword Selection**: User provides a keyword to begin blog creation.
   - Input is sanitized and then passed to the backend.
2. **Outline Generation**: Backend uses OpenAI to generate a detailed outline.
   - User reviews the outline and provides feedback or approval.
3. **Brand Voice Profile**: System checks if a brand voice profile exists.
   - If not, prompts the user with a series of questions to create one.
4. **Draft Generation**: Uses the outline and brand voice profile to create the first blog draft.
5. **Human Review**: User reviews the draft, making edits or approving.
6. **Final Review**: User provides final approval of the content.
7. **Publish & Export**: User can download, publish, or export the content for their purposes.

### Next Steps
- **Enhance Documentation**: Make sure each developer (including myself) references this document for every code addition or change to ensure alignment.
- **Refine Components**: Use this document to identify any components that need refactoring or changes to match the new user flow.
- **Testing and Debugging**: Use the detailed endpoints and settings here to verify that each part of the flow is functioning as intended, using Postman and console logs effectively.

