import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { FiX } from 'react-icons/fi';

const Container = styled.div`
  position: relative;
`;

const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-height: 50px;
  position: relative;
`;

const Tag = styled.span`
  background: rgba(0, 212, 255, 0.2);
  color: ${props => props.theme.colors.primary};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagRemove = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  padding: 0.4rem;
  font-size: 0.9rem;
  min-width: 150px;

  &:focus {
    outline: none;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.theme.gradients.card};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const UsageCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.lightText};
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
`;

const TagInputWithSuggestions = ({ 
  value = [], 
  onChange, 
  suggestions = [], 
  placeholder = "Type and press Enter" 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion.name)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion.name);
  };

  return (
    <Container ref={containerRef}>
      <TagInputContainer>
        {value.map((tag, index) => (
          <Tag key={index}>
            {tag}
            <TagRemove type="button" onClick={() => removeTag(index)}>
              <FiX size={14} />
            </TagRemove>
          </Tag>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(filteredSuggestions.length > 0)}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </TagInputContainer>

      {showSuggestions && (
        <SuggestionsDropdown>
          {filteredSuggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span>{suggestion.name}</span>
              <UsageCount>Used {suggestion.usageCount}×</UsageCount>
            </SuggestionItem>
          ))}
        </SuggestionsDropdown>
      )}
    </Container>
  );
};

export default TagInputWithSuggestions;
