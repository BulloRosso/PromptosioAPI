## StorageService

#### Methods:

1. **savePrompt**
   - **Description**: Saves a prompt to storage.
   - **Endpoint**: `POST /prompts`
   - **Parameters**: 
     - `prompt` (Prompt): The prompt object to save.
   - **Returns**: `void`
   - **Error Handling**: Throws an error if the prompt cannot be saved.

2. **getPrompt**
   - **Description**: Retrieves a prompt from storage.
   - **Endpoint**: `GET /prompts/{id}/{version}`
   - **Parameters**: 
     - `id` (string): The ID of the prompt.
     - `version` (string): The version of the prompt.
   - **Returns**: `Prompt`
   - **Error Handling**: Throws an error if the prompt cannot be retrieved.

3. **deletePrompt**
   - **Description**: Deletes a prompt from storage.
   - **Endpoint**: `DELETE /prompts/{id}/{version}`
   - **Parameters**: 
     - `id` (string): The ID of the prompt.
     - `version` (string): The version of the prompt.
   - **Returns**: `void`
   - **Error Handling**: Throws an error if the prompt cannot be deleted.

4. **listPrompts**
   - **Description**: Lists all prompts in storage.
   - **Endpoint**: `GET /prompts`
   - **Returns**: `Prompt[]`
   - **Error Handling**: Throws an error if the prompts cannot be listed.

5. **getPromptVersions**
   - **Description**: Retrieves all versions of a given prompt.
   - **Endpoint**: `GET /prompts/{id}/versions`
   - **Parameters**: 
     - `id` (string): The ID of the prompt.
   - **Returns**: `string[]`
   - **Error Handling**: Throws an error if the versions cannot be listed.

6. **getSubPrompts**
   - **Description**: Retrieves all sub-prompts of a given parent prompt.
   - **Endpoint**: `GET /prompts/{parentId}/subprompts`
   - **Parameters**: 
     - `parentId` (string): The ID of the parent prompt.
   - **Returns**: `Prompt[]`
   - **Error Handling**: Throws an error if the sub-prompts cannot be retrieved.

#### Private Methods:

- **isValidPrompt**
  - **Description**: Validates if an object is a valid Prompt.
  - **Parameters**: 
    - `obj` (any): The object to validate.
  - **Returns**: `boolean`
