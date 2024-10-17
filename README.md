# AI Blog Post Generation App

## Project Overview
This AI app generates a fully drafted blog post using a structured workflow. It takes a keyword topic as input and produces the draft, SEO meta title, description, and excerpt, allowing for user input at multiple stages. The app ensures content aligns with the user's brand voice while streamlining the entire blog post creation process.

### Core Features:
- **Brand Voice Alignment**: Ensures content matches the user's style and tone.
- **Outline and Draft Generation**: Produces an organized outline and a complete blog post draft.
- **SEO Optimization**: Includes meta title, meta description, and an engaging excerpt.
- **User Review and Editing**: Allows users to review and suggest edits to the outline and draft at multiple stages.
- **Image Prompt Generation**: Suggests image prompts based on the final blog post draft.
- **Future Enhancements**: Potential to include text-to-image generation and advanced keyword research tools.

## Workflow and Requirements

### Detailed Workflow:
1. **Brand Voice Collection**  
   Gather user input about brand voice, tone, and style.  
   **Status**: Completed on 10/8/24

2. **Keyword Input and Topic Understanding**  
   The app takes a keyword, generates a brief overview and a blog post outline based on it.

3. **Outline Creation and Approval**  
   Users can review, approve, or suggest changes to the outline. If changes are suggested, the outline is regenerated based on the feedback and sent to the OpenAI API for a new outline.  
   **Status**: Completed (with troubleshooting and updates for regeneration of the outline based on suggestions).

4. **Draft Generation**  
   Once the outline is approved, the AI writes a full blog post draft based on the outline and keyword. Users can request changes to the draft, and a new version is generated using suggestions.

5. **Draft Review and Editing**  
   Users can review and suggest edits to the draft. Suggestions are passed to the backend to generate an updated version of the draft.  
   **Status**: Completed (including handling of suggestions and regeneration).

6. **SEO Meta Title and Description Creation**  
   The app generates optimized meta titles and descriptions for SEO purposes.

7. **Excerpt Generation**  
   AI generates an engaging summary or excerpt of the blog post.

8. **Final Review and Export**  
   Users finalize the blog post for download or CMS upload.

## Development Phases
1. **Data Collection**  
   Setting up forms for collecting brand voice, user inputs, and keywords.  
   **Status**: Completed

2. **Backend Development**  
   Node.js setup, API integration, and implementation of endpoints for generating outlines, drafts, and handling user inputs.  
   **Status**: Completed

3. **Frontend Development**  
   Building React UI components to handle keyword input, outline generation, draft review, and final export.  
   **Status**: Ongoing

4. **Frontend-Backend Connection**  
   Connecting the frontend with backend API endpoints to manage user interactions and data flow.  
   **Status**: Ongoing

5. **Review Features**  
   Implementing user review features for outline and draft, including handling changes.  
   **Status**: Completed

6. **Testing and Iteration**  
   Testing app functionality, troubleshooting issues (such as error handling during draft generation), and refining features.

7. **Future Enhancements**  
   Planning for text-to-image generation, advanced SEO features, and keyword analysis improvements.

## Key Troubleshooting and Updates:
- **Outline Regeneration**: Added functionality to allow users to provide suggestions for the outline, which are passed back to the OpenAI API to generate a revised outline.
- **Draft Generation after Outline Changes**: Ensured that the blog post draft is generated based on the most recent approved outline, including those regenerated after user suggestions.
- **API Error Handling**: Improved error handling for API calls, particularly during draft generation, ensuring proper logging and communication of issues.
- **Frontend Integration**: Ensured that the `keyword` (user's input) is properly passed as the `topic` to the backend during draft generation to avoid `undefined` errors.

## Milestones and Deadlines
| Milestone                        | Expected Completion Date |
|----------------------------------|-------------------------|
| Data Collection Setup            | Completed                |
| Backend Development              | Completed                |
| Frontend Development             | Ongoing                  |
| Frontend-Backend Connection      | Ongoing                  |
| Implement Review Features        | Completed                |
| Testing and Iteration            | Ongoing                  |
| Planning Future Enhancements     | TBD                      |

## Project Tracking
- **Current Status**: Ongoing development, working on testing, bug fixes, and future enhancements.
- **Notes**: Updated user flow based on testing and troubleshooting. Focused on improving draft and outline regeneration, and ensuring smooth frontend-backend integration.

## Future Enhancements
- **Text-to-Image Generation**: Integration of AI tools to generate relevant blog post images.
- **Advanced SEO Features**: Improved keyword analysis and SEO optimizations for content.

## Component Breakdown

### Frontend Components
- **WizardUI.js**: Main container for the entire step-by-step blog post creation process.
  - **Keyword Input**: Handles user input of the blog topic/keyword.
  - **Outline Generation**: Sends the keyword to the backend for outline creation, allows user review, and handles regeneration based on feedback.
  - **Draft Generation**: Uses the generated outline and keyword to create the blog post draft.
  - **Review Steps**: Allows users to approve the draft or request changes to it.
  - **Final Export**: Provides options for downloading or publishing the content.

### Backend
- **index.js**: Backend server logic. Handles requests for outline and draft generation, as well as managing user input for brand voice profiles and other settings.
  - **Endpoints**:
    - `/generate-outline`: Takes the topic from the frontend and returns an outline.
    - `/generate-draft`: Uses the approved outline and topic to generate the blog post draft.
    - `/regenerate-outline`: Takes user suggestions to regenerate the outline based on feedback.
    - `/regenerate-draft`: Allows suggestions for refining the blog post draft.

### 6. CORS Setup
- **Library Used**: `cors`.
- **Configuration**: CORS is enabled for all routes in development. In production, CORS will be restricted to trusted origins only.

### Security Measures
- **Input Sanitization**: DOMPurify is used to sanitize user input before sending it to the backend to prevent HTML injection.
- **API Interaction**: All inputs are validated and sanitized before sending requests to the OpenAI API.
- **Rate Limiting**: Planned implementation to prevent excessive use of the OpenAI API.

## Next Steps
- **Enhance Documentation**: Update this document based on recent changes.
- **Testing and Debugging**: Continue testing and refining the flow for outline and draft generation, particularly around user feedback handling and API communication.
