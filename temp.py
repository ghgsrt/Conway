# Importing necessary libraries
import re
import os


# Function to parse each block and extract properties
def parse_block(lines):
    result = {}
    multiline_key = None
    multiline_value = ""
    for line in lines:
        line = line.strip()
        if multiline_key:
            if line.endswith('")'):
                multiline_value += line[:-2]
                result[multiline_key] = multiline_value.replace("|", "<br>")
                multiline_key = None
                multiline_value = ""
            else:
                multiline_value += line + " "
            continue

        if '(' in line and ')' in line:
            extracted = re.findall(r'\((.*?)\)', line)[0].strip()
            parts = extracted.split(' ', 1)
            key = parts[0]
            value = parts[1] if len(parts) > 1 else None

            if value:
                if key in ["NORTH", "EAST", "WEST", "SOUTH", "NE", "NW", "SE", "SW", "UP", "DOWN", "IN", "OUT", "LAND"]:
                    value = value.replace("TO ", "").replace(" IS ", "=")
                    comment_match = re.search(r';"(.*?)"', line)
                    if "PER" in value:
                        per_value = value.split("PER")[1].strip()
                        result[f"PER-{key}"] = per_value
                        if comment_match:
                            value = comment_match.group(1)
                result[key] = value
            else:
                multiline_key = key
                multiline_value = ""

    return result


# Function to write each block's properties into a markdown file
def write_markdown_file(filename, block_type, properties):
    with open(filename, 'w') as f:
        f.write("---\n")

        # Aliases
        aliases = properties.get('ALIASES', [])
        f.write(f"aliases: {aliases}\n")

        # Tags
        f.write(f"tags: [{block_type}]\n")

        for key, value in properties.items():
            if key == 'ALIASES':
                continue  # Skip aliases as it's already written

            if isinstance(value, str):
                # Remove leading whitespace for multiline strings
                value = value.lstrip()

                # Ensure closing quote if opening quote is present
                if value.startswith('"') and not value.endswith('"'):
                    value += '"'

                # Handle comma-separated arrays for specific keys
                if key in ["SYNONYM", "ADJECTIVE", "FLAGS"]:
                    value = value.split()
                    value = [v.strip() for v in value]

            f.write(f"{key}: {value}\n")
        f.write("---\n")


# Main function to read the text file and create markdown files
def main():
    blocks = []
    current_block = []
    block_name = None
    block_type = None

    with open("zork.txt", 'r') as f:
        for line in f.readlines():
            line = line.strip()
            if line.startswith('<OBJECT') or line.startswith('<ROOM'):
                if current_block:
                    blocks.append((block_name, block_type, current_block))
                current_block = []
                block_name = line.split()[1]
                block_type = "object" if line.startswith('<OBJECT') else "room"
            elif line.startswith('>') or line == '':
                if current_block:
                    blocks.append((block_name, block_type, current_block))
                    current_block = []
                    block_name = None
                    block_type = None
            else:
                current_block.append(line)

    if current_block:
        blocks.append((block_name, block_type, current_block))

    output_dir = "output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for block_name, block_type, block_lines in blocks:
        properties = parse_block(block_lines)
        if 'DESC' in properties:
            properties['ALIASES'] = [block_name, properties['DESC'].strip('"')]
        else:
            properties['ALIASES'] = [block_name]
        filename = os.path.join(output_dir, f"{block_name}.md")
        write_markdown_file(filename, block_type, properties)


# Uncomment to run the main function
main()
