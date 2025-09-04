import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, FileCode } from 'lucide-react';

interface CodeEditorProps {
	prompt: string;
	onSubmitCode?: (code: string, language: string) => void;
}

const languageSnippets: Record<string, string> = {
	javascript: `// Write your solution in JavaScript
function solve(input) {
	// TODO: implement
	return input;
}

console.log(solve('hello'));`,
	typescript: `// Write your solution in TypeScript
function solve(input: string): string {
	// TODO: implement
	return input;
}

console.log(solve('hello'));`,
	python: `# Write your solution in Python
def solve(input: str) -> str:
	# TODO: implement
	return input

print(solve('hello'))`,
	java: `// Write your solution in Java
class Solution {
	static String solve(String input) {
		// TODO: implement
		return input;
	}
	public static void main(String[] args) {
		System.out.println(solve("hello"));
	}
}`,
};

const CodeEditor: React.FC<CodeEditorProps> = ({ prompt, onSubmitCode }) => {
	const [language, setLanguage] = useState<string>('javascript');
	const [code, setCode] = useState<string>(languageSnippets['javascript']);
	const [output, setOutput] = useState<string>('');

	const handleLanguageChange = (value: string) => {
		setLanguage(value);
		setCode(languageSnippets[value] || '');
		setOutput('');
	};

	const handleRun = () => {
		// Stubbed run - in future, send to backend sandbox
		setOutput('Code submitted. In a real environment, this would run in a sandbox.');
		onSubmitCode?.(code, language);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileCode className="h-5 w-5" /> Coding Workspace
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="p-3 bg-muted rounded-lg">
					<p className="text-sm font-medium text-foreground">{prompt}</p>
				</div>

				<div className="flex items-center gap-3">
					<Select value={language} onValueChange={handleLanguageChange}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="javascript">JavaScript</SelectItem>
							<SelectItem value="typescript">TypeScript</SelectItem>
							<SelectItem value="python">Python</SelectItem>
							<SelectItem value="java">Java</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={handleRun} className="gap-2">
						<Play className="h-4 w-4" /> Run
					</Button>
				</div>

				<Textarea value={code} onChange={(e) => setCode(e.target.value)} className="min-h-[240px] font-mono text-sm" />

				{output && (
					<div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">{output}</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CodeEditor;




