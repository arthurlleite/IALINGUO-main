import zipfile
import os
import shutil

def create_ai_linguo_zip():
    # Create a clean version without node_modules
    source_dir = '/app/ai-linguo'
    zip_path = '/app/ai-linguo.zip'
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Skip node_modules, .next, and other build directories
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.next', '.git', 'dist', 'build']]
            
            for file in files:
                # Skip yarn.lock and other generated files
                if file in ['yarn.lock', 'package-lock.json']:
                    continue
                    
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arc_name)
    
    print(f"Created {zip_path}")
    print(f"Size: {os.path.getsize(zip_path)} bytes")

if __name__ == "__main__":
    create_ai_linguo_zip()